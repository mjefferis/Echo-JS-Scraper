//Handle Scrape button
$("#scrape").on("click", function() {
    axios.get("http://www.echojs.com/").then(function(response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this).children("h2").text();
            result.summary = $(this).children(".summary").text();
            result.link = $(this).children("h2").children("a").attr("href");

            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function(dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });

        });


        //Handle Save Article button
        $("#save").on("click", function() {
            var thisId = $(this).attr("data-id");
            $.ajax({
                method: "POST",
                url: "/articles/save/" + thisId
            }).done(function(data) {

            })
        });

        //Handle Delete Article button
        $("#delete").on("click", function() {
            var thisId = $(this).attr("data-id");
            $.ajax({
                method: "POST",
                url: "/articles/delete/" + thisId
            }).done(function(data) {

            })
        });

