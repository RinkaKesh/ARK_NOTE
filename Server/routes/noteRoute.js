const { authMiddleware } = require("../middlewares/authmiddleware")
const { NoteModel } = require("../models/noteModel")

const noteRoute=require("express").Router()
const cron = require('node-cron');


noteRoute.get("/", async (req, res) => {
    try {
        const allNotes = await NoteModel.find({ userId: req.body.userId });
        res.status(200).send({ message: "success", data: allNotes });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

noteRoute.get("/:_id", async (req, res) => {
    try {
        const specificNote = await NoteModel.findOne(req.params);
        res.status(200).send({ message: "success", data: specificNote });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


noteRoute.post("/create", async (req, res) => {
    try {
        let { title, description, startDate, endDate, userId } = req.body;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);

        let status;
        
        // For same day tasks
        if (start.getTime() === end.getTime()) {
            if (start < today) {
                status = "overdue";
            } else if (start.getTime() === today.getTime()) {
                status = "active";
            } else {
                status = "todo";
            }
        } else {
            // For different start and end dates
            if (start > today) {
                status = "todo";
            } else if (end < today) {
                status = "overdue";
            } else {
                status = "active";
            }
        }

        const newNote = await NoteModel.create({
            title,
            description,
            startDate,
            endDate,
            userId,
            status
        });
        
        res.status(201).send({ message: "Note created successfully", data: newNote });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
noteRoute.patch("/complete/:id", async (req, res) => {
    try {
        const updatedNote = await NoteModel.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { new: true }
        );
        
        if (!updatedNote) {
            return res.status(404).send({ message: "Note not found" });
        }
        
        res.status(200).send({
            message: "Note marked as completed",
            data: updatedNote
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
// Add a route to complete a note
noteRoute.patch("/edit/:id", async (req, res) => {
    try {
        const noteToEdit = await NoteModel.findById(req.params.id);
        if (!noteToEdit) {
            return res.status(404).send({ message: "Note not found" });
        }

        let { startDate, endDate } = req.body;
        let status = req.body.status || noteToEdit.status;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const start = new Date(startDate || noteToEdit.startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate || noteToEdit.endDate);
        end.setHours(0, 0, 0, 0);

        // If changing dates of a completed task, reactivate it
        if (noteToEdit.status === "completed" && (req.body.startDate || req.body.endDate)) {
            // For same day tasks
            if (start.getTime() === end.getTime()) {
                if (start < today) {
                    status = "overdue";
                } else if (start.getTime() === today.getTime()) {
                    status = "active";
                } else {
                    status = "todo";
                }
            } else {
                // For different start and end dates
                if (start > today) {
                    status = "todo";
                } else if (end < today) {
                    status = "overdue";
                } else {
                    status = "active";
                }
            }
        }

        if (start > end) {
            return res.status(400).send({ message: "End date cannot be earlier than start date" });
        }

        const updatedNote = await NoteModel.findByIdAndUpdate(
            req.params.id,
            { ...req.body, status },
            { new: true }
        );

        res.status(200).send({
            message: "Note updated successfully",
            data: updatedNote,
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});
// Add a cron job to update statuses daily


const updateStatuses = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        await NoteModel.updateMany(
            {
                status: { $ne: "completed" },
                endDate: { $lt: today }
            },
            { $set: { status: "overdue" } }
        );
    } catch (error) {
        console.error("Error updating statuses:", error);
    }
};

// Run at midnight every day
cron.schedule('0 0 * * *', updateStatuses);

noteRoute.delete("/delete/:id", async (req, res) => {
    try {
        const noteToDelete = await NoteModel.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Note deleted successfully", data: noteToDelete });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = { noteRoute };
