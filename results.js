// results.js - Handles displaying user's typing test results.

document.addEventListener('DOMContentLoaded', () => {
    // Only run if on the results page (identified by a specific element)
    if (document.getElementById('results-page-container')) { // Add a wrapper ID to the results page section
        displayUserResults();
    }
});

function displayUserResults() {
    const resultsPageContainer = document.getElementById('results-page-container');
    if (!resultsPageContainer) return; // Not on the results page

    const statsGrid = resultsPageContainer.querySelector('.stats-grid');
    const tableBody = resultsPageContainer.querySelector('table tbody');
    const resultsMessageArea = resultsPageContainer.querySelector('#results-message-area'); // Ensure this ID is unique or correctly scoped

    // Validate elements before proceeding
    if (!statsGrid || !tableBody || !resultsMessageArea) {
        console.error("One or more elements for displaying results are missing.");
        return;
    }

    // Clear previous dynamic content
    statsGrid.innerHTML = '';
    tableBody.innerHTML = '';
    resultsMessageArea.innerHTML = '';

    const currentUserName = localStorage.getItem('userName');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn || !currentUserName) {
        resultsMessageArea.innerHTML = '<p>Please log in to view your saved test results. <a href="login.html" class="btn btn-primary btn-sm">Login</a></p>';
        statsGrid.style.display = 'none'; // Hide stats grid
        tableBody.parentElement.style.display = 'none'; // Hide table
        return;
    }

    const userResults = JSON.parse(localStorage.getItem(`userTestResults_${currentUserName}`)) || [];

    if (userResults.length === 0) {
        resultsMessageArea.innerHTML = '<p>No test results yet. <a href="typing-test.html" class="btn btn-accent btn-sm">Take a test</a> to see your progress!</p>';
        statsGrid.style.display = 'none';
        tableBody.parentElement.style.display = 'none';
        return;
    }
    
    // Ensure containers are visible if there are results
    statsGrid.style.display = 'grid'; // Assuming 'grid' is the default display
    tableBody.parentElement.style.display = 'table'; // Assuming 'table' is the default display for the table container

    let totalWpm = 0;
    let totalAccuracyNumeric = 0;
    userResults.forEach(result => {
        totalWpm += parseInt(result.wpm) || 0;
        totalAccuracyNumeric += parseFloat(String(result.accuracy).replace('%', '')) || 0;
    });

    const testsTaken = userResults.length;
    const averageWpm = testsTaken > 0 ? Math.round(totalWpm / testsTaken) : 0;
    const averageAccuracy = testsTaken > 0 ? Math.round(totalAccuracyNumeric / testsTaken) : 0;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Average WPM</div>
            <div class="stat-value">${averageWpm}</div>
            <div class="stat-label">${testsTaken > 1 ? `Based on ${testsTaken} tests` : (testsTaken === 1 ? `Based on 1 test` : `No tests taken`)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Average Accuracy</div>
            <div class="stat-value">${averageAccuracy}%</div>
            <div class="stat-label">${testsTaken > 1 ? `Based on ${testsTaken} tests` : (testsTaken === 1 ? `Based on 1 test` : `No tests taken`)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Tests Taken</div>
            <div class="stat-value">${testsTaken}</div>
            <div class="stat-label">Total tests for ${currentUserName}</div>
        </div>
    `;

    // Display latest results first (userResults are already unshifted)
    userResults.forEach(result => { 
        const row = tableBody.insertRow(); // Inserts at the end by default, which is fine as array is newest first
        row.innerHTML = `
            <td>${result.date || 'N/A'}</td>
            <td>${result.duration || 'N/A'}</td>
            <td>${result.wpm || 0}</td>
            <td>${result.accuracy || '0%'}</td>
            <td>${result.errors || 0}</td>
        `;
    });
}