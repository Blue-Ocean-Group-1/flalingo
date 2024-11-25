import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const createChartDecksData = (data, canvasId) => {
  const beginnerData = [];
  const proficientData = [];
  const advancedData = [];
  const deckNames = data.decksCompleted.map((deck) => deck.deckName);

  data.decksCompleted.forEach((deck) => {
    if (deck.skillLevel === 'beginner') {
      beginnerData.push(deck.average);
      proficientData.push(null); // Ensure alignment for other skill levels
      advancedData.push(null);
    } else if (deck.skillLevel === 'proficient') {
      beginnerData.push(null);
      proficientData.push(deck.average);
      advancedData.push(null);
    } else if (deck.skillLevel === 'advanced') {
      beginnerData.push(null);
      proficientData.push(null);
      advancedData.push(deck.average);
    }
  });

  const ctx = document.getElementById(canvasId).getContext('2d');

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: deckNames, // Deck names as Y-axis labels
      datasets: [
        {
          label: 'Beginner',
          data: beginnerData,
          backgroundColor: 'rgba(152, 208, 121, .8)',
          borderColor: 'rgba(152, 208, 121, 1)',
          borderWidth: 1,
        },
        {
          label: 'Proficient',
          data: proficientData,
          backgroundColor: 'rgba(255, 206, 8, 0.8)',
          borderColor: 'rgba(255, 206, 8, 1)',
          borderWidth: 1,
        },
        {
          label: 'Advanced',
          data: advancedData,
          backgroundColor: 'rgba(255, 2, 86, 0.8)',
          borderColor: 'rgba(255, 2, 86, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y', // Switch X and Y axes for a horizontal bar chart
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16,
            },
          },
        },
        tooltip: {
          titleFont: {
            size: 18,
          },
          bodyFont: {
            size: 16,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 16,
            },
          },
          beginAtZero: true,
          title: {
            display: true,
            text: 'Average Correct',
            font: {
              size: 16,
            },
          },
        },
        y: {
          ticks: {
            font: {
              size: 16,
            },
          },
          title: {
            display: true,
            text: '',
            font: {
              size: 16,
            },
          },
        },
      },
    },
  });
};

export { createChartDecksData };
