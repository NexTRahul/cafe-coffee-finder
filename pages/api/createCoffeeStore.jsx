import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

const createCoffeeStore = async (req, res) => {
  if (req.method == "POST") {
    const { id, name, address, neighbourhood, voting, imgUrl } = req.body;
    try {
      if (id) {
        // Find a record.
        const records = await findRecordByFilter(id);
        if (records.length !== 0) {
          res.json(records);
        } else {
          // Create a record.
          if (name) {
            const createRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighbourhood,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createRecords);

            res.json(records);
          } else {
            res.status(400);
            res.json({ message: "Name is missing." });
          }
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing." });
      }
    } catch (err) {
      console.error("Error creating or finding store:", err);
      res.status(500);
      res.json({ message: "Error creating or finding store:", err });
    }
  }
};

export default createCoffeeStore;
