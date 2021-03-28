$(document).ready(function() {
    $(".delete-story").on("click", function(e) {
        $target = $(e.target);
         const id =  $target.attr("data-id");
         $.ajax({
             type: "DELETE",
             url: "/stories/"+id,
             success: function(response) {
                 alert("Deleting Story");
                 window.location.href="/";
             },
             error: function(err) {
                 console.log(err)
             }
         })
    });
});








// $(document).ready(function() {
//     $(".delete-story").on("click", function(e) {
//         $target = $(e.target);
//         const id = $target.attr("data-id");
//         $.ajax({
//             type: "DELETE",
//             url: "/stories/"+id,
//             success: function(response) {
//                 alert("Deleting Story");
//                 window.location.href="/";
//             },
//             error: (err) => {
//                 console.log(err)
//             }
//         })
//     })
// })