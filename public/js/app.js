//Handle Scrape button
$("#scrape").on("click", function () {
    $.ajax({
        method: "GET",
        url: "/scrape",
    }).done(function (data) {
        console.log(data)
    })
});

//Handle Save Article button
$("#save").on("click", function () {
    $.ajax({
        method: "POST",
        url: "/save/" + thisId
    }).done(function (data) {
        console.log(data)
    });

    //Handle Delete Article button
    $("#delete").on("click", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
            method: "POST",
            url: "/delete/" + thisId
        }).done(function (data) {
            console.log(data)
        })
    });

