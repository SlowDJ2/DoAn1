
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyARHHWkn1e6wqDQ2G6MDUbCd5qpLoJ6ZLc",
    authDomain: "da01-46df6.firebaseapp.com",
    databaseURL: "https://da01-46df6-default-rtdb.firebaseio.com",
    projectId: "da01-46df6",
    storageBucket: "da01-46df6.appspot.com",
    messagingSenderId: "387329132108",
    appId: "1:387329132108:web:07faa45f927a783aac16e9"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  //======================= Door ===============================
  var digital_door = document.getElementById("door-click");
    digital_door.onclick = function() {
        if (document.getElementById("digital-door-checkbox").checked) {
            firebase.database().ref("/Door").update({
                "State": "OFF"
            })
        } else {
            firebase.database().ref("/Door").update({
                "State": "ON"
            })
        }

        firebase.database().ref("/Door/State").once("value", function(snapshot) {
            var doorStatus = snapshot.val();

            let displayImage = document.getElementById('house-lock');
            if (doorStatus === "ON") {
                displayImage.src = '/img/DOOR_OPEN.png';
            } else {
                displayImage.src = '/img/DOOR_CLOSE.png';
            }
        });
    }

//=======================toggleButton - amination ===============================
var toggleButton = document.getElementById('toggleButton');
var currentState = "OFF";

toggleButton.addEventListener('click', function() {
  if (toggleButton.classList.contains('clicked')) {
    toggleButton.classList.remove('clicked');
  } else {
    toggleButton.classList.add('clicked');
  }
});

//=======================toggleButton ===============================
toggleButton.onclick = function() {
    if (currentState === "OFF") {
      currentState = "ON";
      console.log("ON");
    } else {
      currentState = "OFF";
      console.log("OFF");
    }
    
    firebase.database().ref("/ledState").update({
      "State": currentState
    });
  };
//=======================CardValid ===============================
var firebaseRef1 = firebase.database().ref("Card_Valid");
var outputContainer1 = document.querySelector('#CardValid');

firebaseRef1.on("value", function(snapshot) {
    var output1 = '';
  
    snapshot.forEach(function(childSnapshot) {
      var childKey1 = childSnapshot.key;
      var childValue1 = childSnapshot.val();
  
      output1 += "<div>" + childValue1 + " <button class='deleteButton' data-key='" + childKey1 + "'><i class='fa fa-trash'></i></button></div>";
    });
  
    // Xóa nội dung HTML cũ
    outputContainer1.innerHTML = '';
  
    // Thêm nội dung HTML mới
    outputContainer1.innerHTML = output1;
  
    // Gắn sự kiện click cho nút xóa
    // Gắn sự kiện click cho nút xóa
    var deleteButtons = document.getElementsByClassName('deleteButton');
    for (var i = 0; i < deleteButtons.length; i++) {
      deleteButtons[i].addEventListener('click', function() {
        var key = this.getAttribute('data-key');
        // Display a confirmation dialog
        var confirmation = confirm("Are you sure you want to delete this card?");
      
        // If the user confirms the deletion, remove the card from Firebase
        if (confirmation) {
          deleteCard(key);
        }
      });
    }
  });
  
  function deleteCard(key) {
    // Xóa thẻ khỏi Firebase sử dụng key
    firebaseRef1.child(key).remove();
  }
  
//=======================HISTORY CARD ===============================
var firebaseRef = firebase.database().ref("Card");
var outputContainer = document.querySelector('#HISTORYCard');
var cardRef = firebase.database().ref('Card');

firebaseRef.on("value", function(snapshot) {
  var output = '';
  var counter = 0;

  snapshot.forEach(function(parentSnapshot) {
    var parentKey = parentSnapshot.key;
    var childValues = [];

    parentSnapshot.forEach(function(childSnapshot) {
      var childValue = childSnapshot.val();
      childValues.push(childValue);
    });
    if (counter<=9){
        output += "<div>" + childValues.join(", ") + "</div>";
        counter++;
    }
    else{
        // Lấy tham chiếu đến thẻ con đầu tiên trong nút "Card"
        cardRef.orderByKey().limitToFirst(1).once('value')
        .then(function(snapshot) {
        var childKey = Object.keys(snapshot.val())[0]; // Lấy khóa của thẻ con đầu tiên
        var childRef = cardRef.child(childKey); // Tham chiếu đến thẻ con đầu tiên
        childRef.remove()
            .then(function() {
            console.log("Thẻ con đầu tiên đã được xóa thành công!");
            })
            .catch(function(error) {
            console.error("Xảy ra lỗi khi xóa thẻ con đầu tiên:", error);
            });
        })
        .catch(function(error) {
        console.error("Xảy ra lỗi khi truy vấn dữ liệu:", error);
        counter--;
        });
    }
  });

  // Xóa nội dung HTML cũ
  outputContainer.innerHTML = '';

  // Thêm nội dung HTML mới
  outputContainer.innerHTML = output;
});
