const router = require("express").Router(),
    Issue = require("../../db").models.issues;

// get issues list
router.get("", async (req, res) => {
    try {
        const { modelId } = req.query;
        var issues = await Issue.findOne({
            where: {
                modelId
            }
        });

        if (issues) {
            issues.en_issue_list = JSON.parse(issues.en_issue_list);
            issues.es_issue_list = JSON.parse(issues.es_issue_list);
            res.json({
                status: 200,
                issues
            });
        } else {
            res.json({
                status: 404,
                messsage: "No data found"
            });
        }
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// add issues
router.post("", async (req, res) => {
    try {
        req.body.en_issue_list = JSON.stringify(req.body.en_issue_list);
        req.body.es_issue_list = JSON.stringify(req.body.es_issue_list);
        const issue = new Issue(req.body);
        await issue.save();
        res.json({
            status: 200,
            message: "Issues added"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// edit issues
router.put("", async (req, res) => {
    try {
        req.body.en_issue_list = JSON.stringify(req.body.en_issue_list);
        req.body.es_issue_list = JSON.stringify(req.body.es_issue_list);
        const { modelId } = req.body;
        await Issue.update(req.body, {
            where: {
                modelId
            }
        });
        res.json({
            status: 200,
            message: "Issue updated successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

// delete issues
router.delete("", async (req, res) => {
    try {
        const { modelId } = req.query;
        await Issue.destroy({
            where: {
                modelId
            }
        });
        res.json({
            status: 200,
            message: "Issue deleted successfully"
        });
    } catch (e) {
        res.json({
            status: 500,
            message: "Internal server error"
        });
    }
});

module.exports = router;
