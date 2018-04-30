var friendData = require("../data/friends.js");

// Logic to find friend with lowest total difference between survey scores
function friendMatcher(postBody) {
    // Pass the POST request body as a parameter
    var userScores = postBody;
        // Array to collect all the totalDifferences
        var potentialsDiff = [];
        // Run through each potential friend on the server's options
        for (var i = 0; i < friendData.length; i++) {
            var potentialFriendScores = friendData[i].scores;
            var tempArr = [];
            // Compare user's scores to each potential friend's scores to find each questions absolute difference
            for (var e = 0; e < potentialFriendScores.length; e++) {
                var a = Math.abs(userScores[e] - potentialFriendScores[e]);
                tempArr.push(a);
            }

            // Get total difference between user and potential friend by finding the sum of the potential friend's score differences in the tempArr
            var totalDifference = tempArr.reduce(function (accumulator, currentValue) {
                return accumulator + currentValue;
            }, 0);
            // store the potential friend's total difference
            potentialsDiff.push(totalDifference);
        }

        // Find the index of the lowest totalDifference in the potentialsDiff array - this will match the friend's index in friendData
        var lowestDiff = Math.min.apply(Math, potentialsDiff);
        var friendIndex = potentialsDiff.indexOf(lowestDiff);

        return friendIndex
}

module.exports = function (app) {
    // API GET Requests
    // ---------------------------------------------------------------------------
    app.get("/api/friends", function (req, res) {
        res.json(friendData);
    });

    // API POST Requests
    // ---------------------------------------------------------------------------
    app.post("/api/friends", function (req, res) {
        // use friendMatcher to find a friend on server with the closest score and return their index
        res.json(friendData[friendMatcher(req.body.scores)]);
        // new user to the array
        friendData.push(req.body);
    });
};
``