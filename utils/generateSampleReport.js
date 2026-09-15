const ExcelReporter = require('../reporters/ExcelReporter');

(async () => {
  try {
    const reporter = new ExcelReporter();

    // Add sample results
    reporter.results.push({
      module: 'Sample Module',
      testCase: 'sample test 1',
      validation: 'should do X',
      status: 'Pass',
      remarks: 'All good'
    });

    reporter.results.push({
      module: 'Sample Module',
      testCase: 'sample test 2',
      validation: 'should do Y',
      status: 'Fail',
      remarks: 'Error details'
    });

    await reporter.onEnd();

    console.log('Sample report generation complete');
  } catch (err) {
    console.error('Error generating sample report:', err);
    process.exitCode = 1;
  }
})();
