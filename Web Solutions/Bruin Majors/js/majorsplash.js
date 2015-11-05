var myDataRef = new Firebase('https://uclastudentmedia.firebaseio.com/majors');

$( document ).on( "tap", '#submission', function()
{
    var major = $('#major').val();
    var entry = {input: major};
    myDataRef.push(entry);
} );