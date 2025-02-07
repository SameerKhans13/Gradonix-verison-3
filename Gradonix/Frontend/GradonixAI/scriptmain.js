async function generateStudyPlan() {
  const className = document.getElementById("class").value;
  const chapter = document.getElementById("chapter").value;
  const currentMarks = parseFloat(
    document.getElementById("currentMarks").value
  );
  const targetMarks = parseFloat(document.getElementById("targetMarks").value);
  const totalMarks = parseFloat(document.getElementById("totalMarks").value);
  const studyHours = document.getElementById("studyHours").value;

  if (
    !className ||
    !chapter ||
    isNaN(currentMarks) ||
    isNaN(targetMarks) ||
    isNaN(totalMarks) ||
    !studyHours
  ) {
    alert("All fields are required and must be valid numbers!");
    return;
  }

  if (targetMarks > totalMarks) {
    alert("Target marks cannot be greater than total marks!");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/generate-study-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        className,
        chapter,
        currentMarks,
        targetMarks,
        totalMarks,
        studyHours,
      }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    } else {
      const responseText = data;
      const delimiter = "**Study Table:**";
      const parts = responseText.split(delimiter);
      const descriptionText = parts[0].trim();
      const tableMarkdown = parts[1] ? parts[1].trim() : "";

      document.getElementById("studyPlan").innerText = descriptionText;

      const tableLines = tableMarkdown
        .split("\n")
        .filter((line) => line.trim().startsWith("|"));

      if (tableLines.length >= 3) {
        const headers = tableLines[0]
          .split("|")
          .map((h) => h.trim())
          .filter(Boolean);
        const tableData = [];

        for (let i = 2; i < tableLines.length; i++) {
          const rowData = tableLines[i]
            .split("|")
            .map((cell) => cell.trim())
            .filter((cell) => cell !== "");
          if (rowData.length === headers.length) {
            const rowObject = {};
            headers.forEach((header, index) => {
              rowObject[header] = rowData[index];
            });
            tableData.push(rowObject);
          }
        }

        document.getElementById("studyTable").innerHTML =
          buildHTMLTable(tableData);
      }
    }

    // Progress Tracking
    const targetMark = targetMarks - currentMarks;
    const remainingMarks = totalMarks - targetMarks;
    generateChart(currentMarks, targetMark, remainingMarks);

    document.getElementById("analysis").innerText = `You need to improve by ${
      targetMarks - currentMarks
    } marks to reach your target.`;
  } catch (error) {
    alert("Failed to generate study plan. Please try again.");
  }
}

// Function to Generate Chart
    function generateChart(currentMarks, targetMarks, remainingMarks) {
  const ctx = document.getElementById("progressChart").getContext("2d");

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Current Marks", "Target Marks", "Remaining Marks"],
      datasets: [
        {
          label: "Marks Distribution",
          data: [currentMarks, targetMarks, remainingMarks],
          backgroundColor: [
            "rgba(255, 0, 55, 0.6)",
            "rgba(0, 153, 255, 0.6)",
            "rgba(0, 255, 255, 0.6)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.label || "";
              if (label) {
                label += ": ";
              }
              if (context.raw !== null) {
                label += context.raw + " marks";
              }
              return label;
            },
          },
        },
      },
    },
  });
}

// Helper function to convert table data into an HTML table
function buildHTMLTable(data) {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  let html =
    '<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse;">';
  html += "<thead><tr>";
  headers.forEach((header) => {
    html += `<th>${header}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach((row) => {
    html += "<tr>";
    headers.forEach((header) => {
      html += `<td>${row[header]}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
}
