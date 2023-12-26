document.addEventListener("DOMContentLoaded", function () {

    const toggleButton = document.getElementById('start');
    const sectionContent = document.getElementById('sectionContent');
    var sectionContent1=document.getElementById("sectionContent1")
    const container = document.getElementById('container');
    var questionDetailsElement = document.getElementById("question-details");
    var welcome=document.getElementById("welcome");
    var testReportButton;
    const username=document.getElementById('name');
    const grade=document.getElementById("grade")
    const btn=document.getElementById("btn")
    const cb=document.getElementById("c")
    const mb=document.getElementById("m")
    const pb=document.getElementById("p")
    var t = document.getElementById("timer")
  
    var quizDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
    var quizTimer; // Variable to store the timer
    var timeRemaining;
  
    var currentPuzzle = 0;
    var score = 0;
    var skippedQuestions = 0;
    var puzzles = [];
  
    var startTime;
  
    var userName;
    sectionContent.style.display="none";

    var questionStartTimes = [];

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const testType = urlParams.get('test');

    writeToExcel();

    if (!testType) {
      window.location = "../index.html";
    }

    const welcomeHeading = document.getElementById("welcomeHeading");
    welcomeHeading.textContent = `Welcome to ${testType} Diagnostic Test`;
  
    btn.addEventListener('click', () => {
      const trimmedUsername = username.value.trim();
      const trimmedGrade = grade.value.trim();
  
      if (trimmedUsername !== "" && !isNaN(trimmedGrade) && trimmedGrade >= 1 && trimmedGrade <= 15) {
          sectionContent.style.display = "block";
          sectionContent1.style.display = "none";
      } else {
          alert("Please enter a valid name and a grade between 1 and 15.");
      }
    });

 

    toggleButton.addEventListener('click', () => {
      sectionContent.style.display = "none";
      sectionContent1.style.display="none";
      container.style.display = 'block';
      userName = document.getElementById('name').value;
      fetchPuzzles(testType);
      startQuizTimer();
      startTime = new Date();
    });
  
    function startQuizTimer() {
      timeRemaining = quizDuration;
      updateTimer();
      quizTimer = setInterval(function () {
        timeRemaining -= 1000;
        updateTimer();
        if (timeRemaining <= 0) {
          clearInterval(quizTimer);
          showResult();
        }
      }, 1000);
    }
  
    function clearQuizTimer() {
      clearInterval(quizTimer);
    }
  
    function restartQuizTimer() {
      clearQuizTimer();
      startQuizTimer();
    }
  
  
    function updateTimer() {
      var minutes = Math.floor(timeRemaining / 60000);
      var seconds = Math.floor((timeRemaining % 60000) / 1000);
      var timerElement = document.getElementById("timer");
      timerElement.textContent = "Time Remaining: " + minutes + "m " + seconds + "s";
    }
  
    // Function to fetch puzzles from the JSON file
    function fetchPuzzles(testType) {
  
      var grades = parseInt(grade.value); // Parse the input value to an integer
  
      var apiUrl;
      

      if (testType === 'Math') {
        // Load JSON based on grades for math
        if (grades === 1) {
          apiUrl = "../html/json/math/grade1.json";
        } else if (grades === 2) {
          apiUrl = "../html/json/math/grade2.json"; 
        }
        else if (grades === 3) {
          apiUrl = "../html/json/math/grade3.json"; 
        }
        else if (grades === 4) {
          apiUrl = "../html/json/math/grade4.json"; 
        }
        else if (grades === 5) {
          apiUrl = "../html/json/math/grade5.json"; 
        }
        else if (grades === 6) {
          apiUrl = "../html/json/math/grade6.json"; 
        }else if (grades === 7) {
          apiUrl = "../html/json/math/grade7.json"; 
        }
        else if (grades === 8) {
          apiUrl = "../html/json/math/grade8.json"; 
        } else{
          apiUrl = "../html/json/math/highergrade.json"; 
        }
      } else if (testType === 'Coding') {
        if (grades === 1) {
          apiUrl = "../html/json/coding/grade1.json";
        } else if (grades === 2) {
          apiUrl = "../html/json/coding/grade2.json"; 
        }
        else if (grades === 3) {
          apiUrl = "../html/json/coding/grade3.json"; 
        }
        else if (grades === 4) {
          apiUrl = "../html/json/coding/grade4.json"; 
        }
        else if (grades === 5) {
          apiUrl = "../html/json/coding/grade5.json"; 
        }
        else if (grades === 6) {
          apiUrl = "../html/json/coding/grade6.json"; 
        }else if (grades === 7) {
          apiUrl = "../html/json/coding/grade7.json"; 
        }
        else if (grades === 8) {
          apiUrl = "../html/json/coding/grade8.json"; 
        } else{
          apiUrl = "../html/json/coding/highergrade.json"; 
        }
      } else if (testType === 'PublicSpeaking') {
        if (grades === 1) {
          apiUrl = "../html/json/ps/grade1.json";
        } else if (grades === 2) {
          apiUrl = "../html/json/ps/grade2.json"; 
        }
        else if (grades === 3) {
          apiUrl = "../html/json/ps/grade3.json"; 
        }
        else if (grades === 4) {
          apiUrl = "../html/json/ps/grade4.json"; 
        }
        else if (grades === 5) {
          apiUrl = "../html/json/ps/grade5.json"; 
        }
        else if (grades === 6) {
          apiUrl = "../html/json/ps/grade6.json"; 
        }else if (grades === 7) {
          apiUrl = "../html/json/ps/grade7.json"; 
        }
        else if (grades === 8) {
          apiUrl = "../html/json/ps/grade8.json"; 
        } else{
          apiUrl = "../html/json/ps/highergrade.json"; 
        }
      }
  
  
      fetch(apiUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          puzzles = data.puzzles;
          displayPuzzle();
        })
        .catch(function (error) {
          console.log("Error fetching puzzles: ", error);
        });
    }
    function capitalizeEachWord(str) {
      return str.split(' ').map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1)).join(' ');
    }
    // Function to display the current puzzle
    function displayPuzzle() {
      var puzzleContainer = document.getElementById("puzzle-container");
      puzzleContainer.innerHTML = "";
  
      var questionNumberElement = document.createElement("p");
      questionNumberElement.textContent = "Question " + (currentPuzzle + 1) + " of " + puzzles.length;
      puzzleContainer.appendChild(questionNumberElement);
  
      var puzzle = puzzles[currentPuzzle];
      var question = puzzle.question;
      var category = puzzle.category;
      
      // Store the start time for the current question
      questionStartTimes[currentPuzzle] = new Date().getTime();

      var categoryElement = document.createElement("h5");
      categoryElement.id="cat"
      puzzleContainer.appendChild(categoryElement);
      

        
      for (var i = 0; i < question.length; i++) {
        categoryElement.textContent = "Category: "+category; // Set the category for each question
        var questionElement = document.createElement("p");
        questionElement.id="q";
        if (puzzle.image) {
          var imageElement = document.createElement("img");
          imageElement.src = puzzle.image;
          imageElement.style.width = "350px"; // Set the image width to fit within the container
          var questionElement1 = document.createElement("p");
          questionElement1.id="q";
          questionElement1.textContent = question[i];
          puzzleContainer.appendChild(questionElement1);
          questionElement.appendChild(imageElement);

        } else {
          questionElement.textContent = question[i];
        }
        puzzleContainer.appendChild(questionElement);
        
      }
    
  
      var optionsElement = document.createElement("div");
      optionsElement.id = "options";
      puzzleContainer.appendChild(optionsElement);
  
      for (var i = 0; i < puzzle.options.length; i++) {
  
        var option = puzzle.options[i];
        var optionLabel = document.createElement("label");
        optionLabel.classList.add("option");
  
        var optionInput = document.createElement("input");
        optionInput.type = "radio"; // Create radio buttons for single-choice questions
        optionInput.name = "option"; // Use the same name for radio buttons to make them mutually exclusive
        
  
        optionInput.value = i;
        optionInput.style.marginRight = "5px";
        optionLabel.appendChild(optionInput);
  
        if (option.isImage) {
          var image = document.createElement("img");
          image.src = option.image;
          image.style.width = "50%";
          image.style.height="200px"; // Adjust the image size as needed
          optionLabel.appendChild(image);
        } else {
          optionLabel.appendChild(document.createTextNode(option.text));
        }
  
        optionsElement.appendChild(optionLabel);
      }
  
      var submitButton = document.createElement("button");
      submitButton.id = "submit";
      submitButton.textContent = "Submit";
      submitButton.onclick = checkAnswer;
      optionsElement.appendChild(submitButton);
  
      var skipButton = document.createElement("button");
      skipButton.id = "skip";
      skipButton.textContent = "Skip";
      skipButton.onclick = skipQuestion;
      optionsElement.appendChild(skipButton);
  
      // Check if the question has been answered before and update visual feedback
      if (puzzle.hasOwnProperty("userSelectedAnswer")) {
        var selectedOptionIndex = puzzle.userSelectedAnswer;
        var selectedOptionLabel = optionsElement.querySelector(`input[value="${selectedOptionIndex}"]`).parentNode;
        selectedOptionLabel.style.backgroundColor = "orange"; // Previously answered questions are highlighted in orange
      }
    }
  
    function skipQuestion() {
      skippedQuestions++;
      currentPuzzle++;

      var timeSpent = new Date().getTime() - questionStartTimes[currentPuzzle - 1];
      storeTimeSpent(currentPuzzle - 1, timeSpent);

      if (currentPuzzle < puzzles.length) {
        displayPuzzle();
      } else {
        showResult();
        clearQuizTimer();
      }
    }
  
    // Function to check the answer
    function checkAnswer() {
      var selectedOption = document.querySelector('input[name="option"]:checked');
      if (!selectedOption) {
        // If no option is selected, prevent submission and show an alert
        alert("Please select an option before submitting.");
        return;
      }

      var timeSpent = new Date().getTime() - questionStartTimes[currentPuzzle];
      storeTimeSpent(currentPuzzle, timeSpent);
  
      var option = parseInt(selectedOption.value);
      var puzzle = puzzles[currentPuzzle];
      puzzle.userSelectedAnswer = option; // Record the user-selected answer
  
      if (option === puzzle.answer) {
        score++;
      }
  
      currentPuzzle++;
      if (currentPuzzle < puzzles.length) {
        displayPuzzle();
      } else {
        showResult();
        clearQuizTimer();
      }
    }

    function storeTimeSpent(questionIndex, timeSpent) {
      // Store the time spent on the question in the array
      if (!puzzles[questionIndex].hasOwnProperty("timeSpent")) {
        puzzles[questionIndex].timeSpent = [];
      }
      puzzles[questionIndex].timeSpent.push(timeSpent);
    }
  
    // Function to display the final score
    function showResult() {
      writeToExcel();
      container.style.display = 'none';
      
      b1=document.getElementById("b")
      
      var mainElement = document.getElementsByTagName("body")[0];
      
      mainElement.innerHTML = "<h2>Test Result</h2>";
      var grades = parseInt(grade.value);
  
      var nameElement = document.createElement("h4");
      var gradeElement = document.createElement("h4");
      gradeElement.id="g"
      nameElement.id="username";
      nameElement.textContent = "Student Name: " + capitalizeEachWord(userName);
      gradeElement.textContent="Grade: "+(grades)
      mainElement.insertBefore(nameElement, scoreAndTimeContainer);
      mainElement.insertBefore(gradeElement,scoreAndTimeContainer)
  
      var scoreAndTimeContainer = document.createElement("div");
      scoreAndTimeContainer.id = "score-time-container";
  
      
      // Create a new div to show the score
      var scoreElement = document.createElement("div");
      scoreElement.id = "score";
      mainElement.appendChild(scoreElement);
  
      var totalQuestions = puzzles.length;
      var answeredQuestions = totalQuestions - skippedQuestions;
      var percentageScore = (score / totalQuestions) * 100;
  
      var message = "";
      if (percentageScore >= 70) {
        message = "Outstanding!";
      } else if (percentageScore >= 60) {
        message = "Good Job!";
      } else if (percentageScore > 40) {
        message = "Well Done!";
      } else{
        message="Keep Practicing"
      }
  
    // Create a new div for the message
      var messageElement = document.createElement("div");
      messageElement.id = "message";
      messageElement.textContent = message;
  
      // Append the message div above the score div
      var mainElement = document.getElementsByTagName("body")[0];
      mainElement.insertBefore(messageElement, scoreElement);
  
        
  
      scoreElement.innerHTML = "<h4 style='margin:10px 0'>Your score: " + score + " out of " + totalQuestions + "</h4>";
      scoreElement.innerHTML += "<h4 style='margin:10px 0'>Percentage: " + percentageScore.toFixed(2) + "%</h4>";
     
    
     
      
      var endTime = new Date();
      var timeTakenMillis = endTime - startTime;
      var timeTakenMinutes = Math.floor(timeTakenMillis / 60000);
      var timeTakenSeconds = Math.floor((timeTakenMillis % 60000) / 1000);
  
      var timerElement = document.createElement("h4");
      timerElement.id = "timer";
      mainElement.appendChild(timerElement);
  
      var timerElement = document.getElementById("timer");
      timerElement.innerHTML = "<h4 style='margin:10px 0'>Time Taken: " + timeTakenMinutes + "m " + timeTakenSeconds + "s"+"</h4>";
  
      var skippedQuestionsElement = document.createElement("p");
      skippedQuestionsElement.innerHTML = "<h4 style='margin:10px 0'>Skipped Questions: " + skippedQuestions + "</h4>"
      
  
      timerElement.appendChild(skippedQuestionsElement)
      
      
      scoreAndTimeContainer.appendChild(scoreElement);
      scoreAndTimeContainer.appendChild(timerElement);
  
      mainElement.appendChild(scoreAndTimeContainer);
     
  
  
      // Stop the quiz timer and clear the interval
      clearInterval(quizTimer);
  
      var exportPDFButton = document.createElement("button");
      exportPDFButton.textContent = "Export as PDF";
      exportPDFButton.id = "export-pdf-button";
      exportPDFButton.style.textAlign = "center";
      document.body.appendChild(exportPDFButton);
  
      // Event listener to export the result page as a PDF when the "Export as PDF" button is clicked
      exportPDFButton.addEventListener("click", function () {
        exportResultAsPDF();
      });
      // Create a new canvas to display the chart
      var chartCanvas = document.createElement("canvas");
      chartCanvas.id = "myChart";
      chartCanvas.width = "600";
      chartCanvas.height = "400";
      mainElement.appendChild(chartCanvas);
  
      // Call the generateChart() function to display the score chart
      
     
      testReportButton = document.createElement("button");
      testReportButton.textContent = "Detail Analysis";
      testReportButton.id = "test-report-button";
      testReportButton.style.textAlign="center";
      mainElement.appendChild(testReportButton);
  
      // Event listener to show question details when the "Test Report" button is clicked
      var closeButton = document.createElement("button");
      closeButton.textContent = "Close";
      closeButton.id = "close-button";
      closeButton.style.display = "none"; // Initially hide the close button
      mainElement.appendChild(closeButton);
  
      // Event listener to show question details when the "Test Report" button is clicked
      testReportButton.addEventListener("click", function () {
        var questionDetailsElement = document.getElementById("question-details");
        var closeButton = document.getElementById("close-button");
        questionDetailsElement.style.display = "block";
        closeButton.style.display = "block";
        testReportButton.style.display = "none"; // Hide the "Test Report" button when showing the details
      });
  
      // Event listener to close question details when the "Close" button is clicked
      closeButton.addEventListener("click", function () {
        var questionDetailsElement = document.getElementById("question-details");
        var testReportButton = document.getElementById("test-report-button");
        questionDetailsElement.style.display = "none";
        closeButton.style.display = "none";
        testReportButton.style.display = "block"; // Show the "Test Report" button when closing the details
      });
  
      var testReportContainer = document.createElement("div");
      testReportContainer.id = "test-report-container";
      mainElement.appendChild(testReportContainer);
  
      testReportContainer.appendChild(testReportButton);
      testReportContainer.appendChild(closeButton)
  
  
      var questionDetailsElement = document.createElement("div");
      questionDetailsElement.id = "question-details";
      mainElement.appendChild(questionDetailsElement);
  
      for (var i = 0; i < puzzles.length; i++) {
        var puzzle = puzzles[i];
    
        var questionInfo = document.createElement("p");
        questionInfo.id="qinfo";
        questionInfo.textContent = "Question No :" + (i + 1);
  
        // Check if the question has been answered before and update visual feedback
        if (puzzle.hasOwnProperty("userSelectedAnswer")) {
          var selectedOptionIndex = puzzle.userSelectedAnswer;
          var selectedOptionLabel = puzzle.options[selectedOptionIndex].text;
          var answerStatus = selectedOptionIndex === puzzle.answer ? "Correct" : "Incorrect";
      
          var userAnswerInfo = document.createElement("p");
          userAnswerInfo.textContent = "Your Answer: " + selectedOptionLabel + " (" + answerStatus + ")";
      
          // Add CSS class based on the answer status
          userAnswerInfo.classList.add(answerStatus.toLowerCase());
      
          questionDetailsElement.appendChild(questionInfo);
          questionDetailsElement.appendChild(userAnswerInfo);

          // Display the time spent on each question in the detail analysis
          if (puzzles[i].hasOwnProperty("timeSpent")) {
            var timeSpentElement = document.createElement("p");
            timeSpentElement.classList.add("time")
            timeSpentElement.textContent =
              "Time Spent: " + formatTime(puzzles[i].timeSpent.reduce((a, b) => a + b, 0));
            timeSpentElement.id = "time-spent";
            questionDetailsElement.appendChild(timeSpentElement);
          }
        } else {
          var skippedInfo = document.createElement("p");
          skippedInfo.textContent = "Skipped";
      
          // Add CSS class for skipped answers
          skippedInfo.classList.add("skipped");
      
          questionDetailsElement.appendChild(questionInfo);
          questionDetailsElement.appendChild(skippedInfo);
        }
      
        var questions = puzzle.question;
        for (var j = 0; j < questions.length; j++) {
            var questionLineInfo = document.createElement("p");
            questionLineInfo.id="info";
            questionLineInfo.textContent = questions[j];
            questionDetailsElement.appendChild(questionLineInfo);
        }
        for (var j = 0; j < questions.length; j++) {
          var questionLineInfo = document.createElement("p");
          questionLineInfo.id="info";
          if (puzzle.image) {
            var el=document.createElement("div");
            el.id="el"
            var imageElement = document.createElement("img");
            imageElement.id="im";
            imageElement.src = puzzle.image;
            imageElement.style.maxWidth = "100%";
            imageElement.style.alignItems="center";
            // Set the image width to fit within the container
            el.appendChild(imageElement)
            questionDetailsElement.appendChild(el);
          } else {
            questionLineInfo.textContent = questions[j];
          }
          
        }
  
        var imageAnswerInfo = document.createElement("div");
        imageAnswerInfo.id="el";
  
        if (puzzle.options[puzzle.answer].isImage) {
          var correctAnswerImage = document.createElement("img");
          correctAnswerImage.src = puzzle.options[puzzle.answer].image;
          correctAnswerImage.style.maxWidth = "100%";
          imageAnswerInfo.appendChild(correctAnswerImage);
        }
  
        questionDetailsElement.appendChild(imageAnswerInfo);
  
        // Display the correct answer on a new line
        var correctAnswerInfo = document.createElement("p");
        correctAnswerInfo.textContent = "Correct Answer: " + puzzle.options[puzzle.answer].text;
        correctAnswerInfo.id="cinfo";
  
        // Append a line break before the correct answer to separate it from the user's answer
        questionDetailsElement.appendChild(correctAnswerInfo);
        questionDetailsElement.appendChild(document.createElement("br"));
      }
  
    
      generateChart()
    }

    // function to write data to excel
    function writeToExcel() {
      var url = 'https://docs.google.com/spreadsheets/d/1yWkdI7ommckn-WLfZMHddIQMbkx7IVttyP3WY3FkyMI/edit';

      /* set up async GET request */
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      req.onload = function(e) {
        var workbook = XLSX.read(req.response);
        var dataToAdd = [{
          "name": "abc",
          "grade": "asd"
        }]
        var ws = workbook.Sheets["Sheet1"];
        XLSX.utils.sheet_add_json(ws, dataToAdd, {origin: -1, skipHeader: true});

        // XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
        XLSX.writeFile(workbook, "sdsdfdf");
      };

      req.send();
      /* download data into an ArrayBuffer object */
      // fetch(url).then(res => {
      //   return res.arrayBuffer();
      // }).then(ab => {
        // const ws = XLSX.read(ab);
        // const aoa = [["abc", "wsss", "wsss"]]
        // XLSX.utils.sheet_add_aoa(ws, aoa, {origin: -1});
        // const wb = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        // XLSX.writeFile(ws, "sdsdfdf");
        
      // });
    }
    
    function formatTime(milliseconds) {
      var minutes = Math.floor(milliseconds / (60 * 1000));
      var seconds = Math.floor((milliseconds % (60 * 1000)) / 1000);
      return minutes + "m " + seconds + "s";
    }
  
    
    // Rest of your existing code
    
    function exportResultAsPDF() {
      const pdfOptions = {
        margin: 10,
        filename: "quiz_result.pdf",
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };
  
      html2pdf().from(document.body).set(pdfOptions).save();
    }
    // Function to generate the chart
    function generateChart() {
      var categoryData = {}; // Object to store category-wise data
  
      // Calculate data for each category
      puzzles.forEach(function (puzzle) {
        var category = puzzle.category;
        if (!categoryData[category]) {
          categoryData[category] = {
            correct: 0,
            incorrect: 0,
            skipped: 0,
            totalQuestions: 0,
          };
        }
  
        categoryData[category].totalQuestions++;
  
        if (puzzle.userSelectedAnswer !== undefined) {
          if (puzzle.userSelectedAnswer === puzzle.answer) {
            categoryData[category].correct++;
          } else {
            categoryData[category].incorrect++;
          }
        } else {
          categoryData[category].skipped++;
        }
      });
  
      
  
      var totalQuestions = puzzles.length;
  
      var chartData = {
        labels: Object.keys(categoryData),
        datasets: [
          {
            data: Object.values(categoryData).map(function (data) {
              return (data.correct / (data.correct + data.incorrect + data.skipped)) * 100;
            }),
            backgroundColor: "green",
            label: "Correct Answers",
          },
          {
            data: Object.values(categoryData).map(function (data) {
              return (data.incorrect / (data.correct + data.incorrect + data.skipped)) * 100;
            }),
            backgroundColor: "red",
            label: "Incorrect Answers",
          },
          {
            data: Object.values(categoryData).map(function (data) {
              return (data.skipped / (data.correct + data.incorrect + data.skipped)) * 100;
            }),
            backgroundColor: "orange",
            label: "Skipped Questions",
          },
        ],
      };
  
      var chartOptions = {
        responsive: false,
        maintainAspectRatio: false,
        title: {
          display: true,
          fontSize: 20,
          text: "Quiz Performance Report",
          fontColor: "black",
          backgroundColor: "blue",
          padding: 10,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                max: 100,
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              barThickness: 50,
            },
            
  
          ],
          
        },
       
        plugins: {
          datalabels: {
            color: "black",
            anchor: "center",
            align: "center",
            formatter: function (value, context) {
              var total = context.dataset.data.reduce(function (acc, data) {
                return acc + data;
              }, 0);
              var percentage = (value / total) * 100;
              var formattedPercentage = percentage.toFixed(2);
        
              var category = context.dataset.label; // Get the category label from the dataset
              var totalQuestions = categoryData[category].totalQuestions; // Get the total question count for the category
        
              return formattedPercentage + "%\n(" + totalQuestions + " Questions)"; // Display percentage and question count
            },
          },
          afterDraw: function (chart) {
            var ctx = chart.ctx;
            var categoryKeys = Object.keys(categoryData);
        
            categoryKeys.forEach(function (category, index) {
              var datasetMeta = chart.getDatasetMeta(0);
              var model = datasetMeta.data[index]._model;
              var total = categoryData[category].totalQuestions;
        
              // Display the label beneath the bar
              ctx.fillStyle = "black";
              ctx.textBaseline = "middle";
              ctx.font = "12px Arial";
              ctx.fillText("Total: " + total, model.x + model.width / 2, model.y + model.height + 15);
            });
          },
        },
  
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return Chart.defaults.global.tooltips.callbacks.label(tooltipItem, data) + '%';
            }
          }
        },
        
        
        legend: {
          id:'l',
          display: false,
          position: "bottom",
          align: "center",
          fullWidth: true,
          labels: {
            id:'la',
            usePointStyle: true,
            boxWidth: 0,
            fontSize: 10,
            padding: 10,
            fontColor: "black",
            display: "block", // Set display to "block" for block mode
            generateLabels: function (chart) {
              var data = chart.data;
              if (data.labels.length && data.datasets.length) {
                return data.labels.map(function (label, i) {
                  var meta = chart.getDatasetMeta(0);
                  var style = meta.controller.getStyle(i);
                  return {
                    text: label,
                    fillStyle: style.backgroundColor,
                    hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                    index: i,
                  };
                });
              }
              return [];
            },
          },
        },
        
        
      };
    
  
      // Create the chart
      var ctx = document.getElementById("myChart").getContext("2d");
      var myChart = new Chart(ctx, {
        type: "horizontalBar", // Changed to horizontalBar chart
        data: chartData,
        options: chartOptions,
      });
  
      // Update the legend with category percentages
      var chartLegend = myChart.legend.legendItems;
      var legendContainerElement = document.createElement("div");
      legendContainerElement.className = "legend-container";
  
      
      for (var i = 0; i < chartLegend.length; i++) {
        var legendItem = chartLegend[i];
        var category = legendItem.text;
        var categoryPercentage = (categoryData[category].correct / (categoryData[category].correct + categoryData[category].incorrect + categoryData[category].skipped)) * 100;
            
        var questionCount = categoryData[category].totalQuestions; // Get the total question count for the category
        
        var legendItemElement1 = document.createElement("div");
        legendItemElement1.textContent = category
        legendItemElement1.id="l1";
  
        var legendItemElement2 = document.createElement("div");
        legendItemElement2.textContent = "No. of Questions "+ questionCount;
        legendItemElement2.id="l2";
  
        var legendItemElement3 = document.createElement("div");
        legendItemElement3.textContent = "Percentage Scored: " +categoryPercentage.toFixed(2) + "% ";
        legendItemElement3.id="l3";
  
        
        legendContainerElement.appendChild(legendItemElement1);
        legendContainerElement.appendChild(legendItemElement2);
        legendContainerElement.appendChild(legendItemElement3);
      }
  
      var myChartElement = document.getElementById("myChart");
      myChartElement.insertAdjacentElement("afterend", legendContainerElement);
  
      var chartParent = chartCanvas.parentElement;
  
      // Create a new container div for the chart
      var chartContainerElement = document.createElement("div");
      chartContainerElement.className = "chart-container";
  
      // Create a div element for the chart title
      var chartTitleElement = document.createElement("div");
      chartTitleElement.className = "chart-title";
      chartTitleElement.textContent = "Quiz Performance Report";
  
      // Append the chart title to the container div
      chartContainerElement.appendChild(chartTitleElement);
  
      // Move the canvas inside the container div
      chartContainerElement.appendChild(chartCanvas);
  
      document.getElementById("myChart").outerHTML = chartContainerElement.outerHTML;
  
      // Replace the original canvas element with the new container div
      chartParent.innerHTML = chartContainerElement.outerHTML;
  
    }
  
    
  });