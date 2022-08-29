import React, { MouseEventHandler, ReactElement, useId } from 'react';
import Holder, { HolderItemProps } from '../base/Holder';
import Color from 'color';
import './index.css';

/*----------------------------------------------------------------------------*/

interface ButtonStateProps {
  state?: string;
  onClick?: MouseEventHandler;
  text?: string;
  color?: string;
  symbol?: any;
  symbolLeft?: boolean;
  symbolRight?: boolean;
  radiate?: boolean;

  __parentName?: string;
  __active?: boolean;
}

function _ButtonState(props: ButtonStateProps, ref: React.Ref<HTMLElement>) {
  const { text, __parentName, __active, symbol: Symbol, symbolLeft, symbolRight, state } = props;
  if (__parentName == null || __active == null) return null;

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={`button-inner button-inner-${__parentName}-${state}` + (__active ? " active" : "")}>
      { Symbol && symbolLeft && <Symbol/> }
      { text ? " " + text + " " : "" }
      { Symbol && symbolRight && <Symbol/> }
    </div>
  );
}

/*----------------------------------------------------------------------------*/

interface ButtonProps {
  name?: string;
  state?: string;
  onClick?: MouseEventHandler;
  children?: React.ReactElement | React.ReactElement[];
}

function _Button(props: ButtonProps) {
  const { name, state, onClick, children } = props;
  const activeProps = React.useRef<any>(null);
  const uuid = useId();

  const handleChild = React.useCallback((args: HolderItemProps) => {
    const { child, activeKey } = args;
    const { type: Type, props } = child;

    if (Type !== ButtonState) {
      console.error(`Type ${Type} found in Button ${name}.`);
      return null;
    }

    const { state: _state } = props;
    const active = activeKey != null &&
                   _state != null &&
                   activeKey.toString() === _state.toString();

    if (active) { 
      activeProps.current = props as ButtonStateProps;
    }
    
    return (
      <ButtonState {...props}
                   __parentName={name ?? uuid}
                   __active={active}
                   key={_state}/>
    )
  }, [ uuid, name ]);

  const handleTotal = React.useCallback((element: ReactElement) => {
    const { type: Type, props, key } = element;
    const aprops = activeProps.current;
    if (aprops == null) return null;

    return <Type {...props}
                 key={key}
                 onClick={aprops.onClick ?? onClick}
                 style={{
                  ...props.style,
                  "--color": Color(aprops.color).array().join(", "),
                  "--radiation": aprops.radiate ? "var(--radiate)" : "linear-gradient(45deg, #0000, #0000)",
                }}
                className={`button-outer button-outer-${name}-${state}`}/>;
  }, [ state, onClick, name ]);

  return (
    <Holder onTotal={handleTotal} onChild={handleChild} activeKey={state}>
      {children}
    </Holder>
  );
}

/*----------------------------------------------------------------------------*/

const ButtonState = React.memo(React.forwardRef(_ButtonState));

const Button = React.memo(_Button);

export { Button, ButtonState };