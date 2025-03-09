const fs = require('fs');

// Load coverage data from the coverage-final.json file
const coverageData = JSON.parse(fs.readFileSync('coverage/coverage-summary.json', 'utf8')).total;

// Define the threshold for the coverage percentage
const COVERAGE_THRESHOLD = 85;

// Function to format coverage and apply color rules
function formatCoverage(coverageType, value) {
  if (value < COVERAGE_THRESHOLD) {
    return `**<span style="color:red">${value}%</span>**`;
  } else {
    return `${value}%`;
  }
}

// Function to generate the markdown comment
function generateCoverageComment(coverageData) {
  // Extract the percentage values for each coverage type
  const linesCoverage = coverageData.lines.pct;
  const statementsCoverage = coverageData.statements.pct;
  const functionsCoverage = coverageData.functions.pct;
  const branchesCoverage = coverageData.branches.pct;

  // Check if any of the coverage values are below the threshold
  const coverageBelowThreshold =
    linesCoverage < COVERAGE_THRESHOLD ||
    statementsCoverage < COVERAGE_THRESHOLD ||
    functionsCoverage < COVERAGE_THRESHOLD ||
    branchesCoverage < COVERAGE_THRESHOLD;

  if (coverageBelowThreshold) {
    // If coverage is below the threshold, generate the markdown with coverage details
    let message = `### 🚨 Test Coverage Below 85% 🚨\n\n`;

    message += `The current test coverage does not meet the required 85% threshold. Please improve the following coverage metrics:\n\n`;

    message += `| Coverage Type | Current Coverage |\n`;
    message += `| -------------- | ---------------- |\n`;
    message += `| **Lines**      | ${formatCoverage('lines', linesCoverage)}              |\n`;
    message += `| **Statements** | ${formatCoverage('statements', statementsCoverage)}           |\n`;
    message += `| **Functions**  | ${formatCoverage('functions', functionsCoverage)}             |\n`;
    message += `| **Branches**   | ${formatCoverage('branches', branchesCoverage)}           |\n`;

    return message;
  } else {
    // If all coverage metrics are above the threshold, show a success message
    return `### ✅ Test Coverage Meets Requirements ✅\n\nAll test coverage metrics are above the 85% threshold. Great work! 🎉`;
  }
}

// Generate the comment
const commentMessage = generateCoverageComment(coverageData);

// Output the message (this can be posted to GitHub via a bot or saved to a file)
fs.writeFileSync('coverage-comment.md', commentMessage);
console.log('Coverage report has been generated in coverage-comment.md');
