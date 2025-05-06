import agents from "../../../config/agents.json";
import config from "../../config";
import Chain, { STATUS } from "../../models/datalog";
import Files from "../../models/files";
import logger from "../../utils/logger";
import { cat } from "./tools";

async function getNewRows() {
  return await Chain.find({ status: STATUS.NEW, sender: agents }, [
    "id",
    "block",
    "sender",
    "resultHash",
    "timechain",
  ])
    .limit(config.PARSER_LIMIT || 50)
    .sort([["createdAd", -1]])
    .lean();
}

function read(ipfshash) {
  return cat(ipfshash, {
    timeout: Number(config.TIMEOUT_CAT),
  })
    .then((result) => {
      try {
        return JSON.parse(result);
      } catch (_) {
        const e = new Error(`error json ${ipfshash}`);
        e.type = "JSON_PARSE";
        throw e;
      }
    })
    .catch((e) => {
      if (e.type === "JSON_PARSE") {
        throw e;
      } else {
        const e = new Error(`not found ${ipfshash}`);
        e.type = "NOT_FOUND";
        throw e;
      }
    });
}

function mapper(json, id) {
  const list = [];
  for (const item of json) {
    if (item.cid && item.filename && item.timestamp) {
      list.push({ datalog_id: id, ...item });
    }
  }
  return list;
}

export default async function parser(cb = null) {
  const rows = await getNewRows();
  for (const row of rows) {
    try {
      logger.info(`read file ${row.resultHash}`);
      if (row.resultHash.substring(0, 2) !== "Qm") {
        console.log("skip");
        await Chain.updateOne(
          {
            _id: row._id,
          },
          { status: STATUS.ERROR }
        ).exec();
        continue;
      }

      let data;
      let list = [];
      try {
        data = await read(row.resultHash);
        list = mapper(data, row._id);
      } catch (error) {
        console.log(error);
        await Chain.updateOne(
          {
            _id: row._id,
          },
          { status: STATUS.ERROR }
        ).exec();
        continue;
      }

      // const list = mapper(data, row._id);
      const listFiltered = [];
      for (const item of list) {
        const isRow = await Files.findOne({ cid: item.cid }).lean();
        if (isRow === null) {
          listFiltered.push(item);
        }
      }
      if (listFiltered.length > 0) {
        await Files.insertMany(listFiltered);
      }
      await Chain.updateOne(
        {
          _id: row._id,
        },
        { status: STATUS.READY }
      ).exec();
      if (cb) {
        for (const item of listFiltered) {
          try {
            cb(item);
            // eslint-disable-next-line no-empty
          } catch (_) {}
        }
      }
    } catch (error) {
      logger.error(`parser ${error.message}`);
    }
  }
  setTimeout(() => {
    parser(cb);
  }, 15000);
}
