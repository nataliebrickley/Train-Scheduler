// Initialize Firebase
var config = {
  apiKey: "AIzaSyDbe98c-uPp571CdWjBvVjoKRi2wM7bja8",
  authDomain: "train-scheduler-70b27.firebaseapp.com",
  databaseURL: "https://train-scheduler-70b27.firebaseio.com",
  projectId: "train-scheduler-70b27",
  storageBucket: "train-scheduler-70b27.appspot.com",
  messagingSenderId: "591577837073"
};
firebase.initializeApp(config);
  var database = firebase.database();
  //when the user submits the form...
  $("#submit").on("click", function(){
    //prevent the page from refreshing
    event.preventDefault();
    //push user data to the database:
    var name= $("#name").val().trim()
    var  destination= $("#destination").val().trim()
    var  time= $("#time").val().trim()
    var frequency= $("#frequency").val().trim()
    
    var train = {
      name: name,
      destination: destination,
      time: time,
      frequency: frequency
    }
    database.ref().push(train);
    //for each train, get data from database and populate table values
    
  })
  database.ref().on("child_added", function(childSnapshot){
    //console.log(childSnapshot.val())

    var row = $("<tr>")
    var name = $("<td>").text(childSnapshot.val().name)
    var destination = $("<td>").text(childSnapshot.val().destination)
    //var time = $("<td>").text(childSnapshot.val().time)
    var frequency = $("<td>").text(childSnapshot.val().frequency)
    
    //calculate next train arrival:
    var tFrequency = childSnapshot.val().frequency;
    var firstTime = childSnapshot.val().time
     // First Time (pushed back 1 year to make sure it comes before current time)
     var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
     console.log(firstTimeConverted);
     // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    var minutes = $('<td>').text(tMinutesTillTrain)

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    var nextArrrival = $("<td>").text(moment(nextTrain).format("hh:mm"))

    row.append(name, destination, frequency, nextArrrival, minutes);
    $("tbody").append(row)
    
})

