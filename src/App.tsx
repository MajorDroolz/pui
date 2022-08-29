import React from 'react';
import './App.css';
import { Button, ButtonState } from './components';
import { MdDownload, MdCheck } from 'react-icons/md';
import { AiOutlineLoading } from 'react-icons/ai';

/*----------------------------------------------------------------------------*/

function App() {
  const [ state, setState ] = React.useState("download");

  const handleLoaded = React.useCallback(() => {
    setState("complete");
  }, [ setState ]);

  const handleDownload = React.useCallback(() => {
    setState("loading");
    setTimeout(handleLoaded, 2000);
  }, [ setState, handleLoaded ]);

  const handleComplete = React.useCallback(() => {
    setState("download");
  }, [ setState ]);

  return (
    <div className="app">
      <Button state={state} name="test">
      <ButtonState state="download" text="DOWNLOAD" color="#01BAEF" symbol={MdDownload} symbolLeft radiate onClick={handleDownload}/>
        <ButtonState state="loading" color="#B5D2CB" symbol={AiOutlineLoading} radiate symbolRight/>
        <ButtonState state="complete" text="COMPLETE" color="#5EEB5B" symbol={MdCheck} symbolLeft radiate onClick={handleComplete}/>
      </Button>
    </div>
  );
}

export default React.memo(App);