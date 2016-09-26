const {Header, HeaderRow} = require('react-mdl');
const TopText = require('./top-text');
const RunButton = require('./run-button');
const TargetsDropdown = require('./targets-dropdown');
const TestsDropdown = require('./tests-dropdown');

module.exports = function Top() {
  return (
    <Header>
      <HeaderRow>
        <TopText>Tests:</TopText>
        <TestsDropdown/>
        <RunButton/>
        <div className="mdl-layout-spacer"></div>
        <TopText>Target:</TopText>
        <TargetsDropdown/>
      </HeaderRow>
    </Header>
  );
};
