const {observer} = require('mobx-react');
const {Layout, Content} = require('react-mdl');
const Title = require('./title');
const Top = require('./top');
const TabBar = require('./tab-bar/tab-bar');
const Tabs = require('./tabs');
const UploadBar = require('./upload-bar');

module.exports = observer(function App() {
  return (
    <Layout fixedHeader>
      <Title/>
      <Top/>
      <TabBar/>
      <Content className="flex-container">
        <Tabs/>
      </Content>
      <UploadBar/>
    </Layout>
  );
});


