$(document).ready(function() {
    $('.card').click(function(){
        var attribute = $(this).attr("data-course");
        window.location.href = "/dashboard/courses/" + attribute;
    })
});
