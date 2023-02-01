import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method == "PUT") {
    const { id } = req.body;
    try {
      if (id) {
        // Find a record.
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          const record = records[0];
          const calculateVote = parseInt(record.voting) + 1;
          // Update a record.
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: calculateVote,
              },
            },
          ]);
          if (updateRecord) {
            const miniRecord = getMinifiedRecords(updateRecord);
            res.json(miniRecord);
          }
        } else {
          res.json({ message: "Coffee Store not found." });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: "Error upvoting coffee store", error });
    }
  }
};

export default favouriteCoffeeStoreById;
