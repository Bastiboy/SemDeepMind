$(document).ready(function(){

    $('.startTestButton').click(function() {
        //If names and passwd are given
        var lastname = $('.form_lastname').val();
        var name = $('.form_name').val();
        var passwrd = $('.form_password').val();

        if(lastname != "" && name != "" && passwrd != "") {
            $('.intelligenceTest').show();
        } else {
            alert("Veuillez renseigner les champs pour s'inscrire.")
        }
    });

    $('.closepopup').click(function() {
        $('.intelligenceTest').hide();
    });

    $('.validateTest').click(function() {
        //GET DATA
        var data = {};

        //Add password, name and lastname
        data.lastname = $('.form_lastname').val();
        data.name = $('.form_name').val();
        data.password = $('.form_password').val();

        var testAnswers = [];
        for(var i = 1; i <= 80; i++) {
            testAnswers.push($('input[value=q' + i + ']').val())
        }
        data.testAnswers = testAnswers;


        $.ajax({
            url: '/signin',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (result) {
                window.location.href = "/dashboard";
            }}
        )
    });
});
