import React from 'react';
import { useMachine } from '@xstate/react';
import styled from 'styled-components';

import machine from './machine';

const Input = styled.input`
  font-size: 32px;
  color: #333;
  text-align: right;
  padding: 5px 13px;
  width: 100%;
  border: none;
  border-bottom: 1px solid gray;
  box-sizing: border-box;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 15px;
`;

const Button = styled.button`
  padding: 10px;
  font-size: 22px;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 2px;
  border: 0;
  outline: none;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
  &:hover {
    opacity: 1;
  }
  &:active {
    background: #999;
    box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);
  }

  &.two-span {
    grid-column: span 2;
    background-color: #3572db;
  }
`;

const buttons = [
  'C',
  'CE',
  '/',
  '7',
  '8',
  '9',
  'x',
  '4',
  '5',
  '6',
  '-',
  '1',
  '2',
  '3',
  '+',
  '0',
  '.',
  '=',
  '%',
];

function isOperator(text) {
  return '+-x/'.indexOf(text) > -1;
}

const Calculator = () => {
  const [state, sendMachine] = useMachine(machine, {});

  function send(event, payload) {
    console.log('Event - Payload', { event, payload });

    sendMachine(event, payload);
  }

  const handleButtonClick = item => () => {
    if (Number.isInteger(+item)) {
      send('NUMBER', { key: +item });
    } else if (isOperator(item)) {
      send('OPERATOR', { operator: item });
    } else if (item === 'C') {
      send('CLEAR_EVERYTHING', {});
    } else if (item === '.') {
      send('DECIMAL_POINT', {});
    } else if (item === '%') {
      send('PERCENTAGE', {});
    } else if (item === 'CE') {
      send('CLEAR_ENTRY', {});
    } else {
      send('EQUALS', {});
    }
  };

  return (
    <div
      className="w-full h-auto border-gray-500 border-solid border-2 mt-4 mx-auto"
      style={{
        width: 300,
      }}
    >
      <div>
        <Input
          className="w-full text-right px-5 py-2 border-none outline-none"
          type="text"
          value={state.context.display}
          disabled
        />
      </div>
      <ButtonGrid className="w-full px-5 py-2">
        {buttons.map((btn, index) => (
          <Button
            className={btn === 'C' ? 'two-span' : ''}
            type="button"
            key={index}
            onClick={handleButtonClick(btn)}
          >
            {btn}
          </Button>
        ))}
      </ButtonGrid>

      <div
        className="mt-4 px-5 pb-4"
        css={`
          p,
          pre,
          code {
            text-align: left;
            margin: 0;
            padding: 0;
          }
        `}
      >
        <p className="mt-1">State</p>
        <pre>
          <code>{JSON.stringify(state.value, null, 2)}</code>
        </pre>
        <p className="mt-1">Context:</p>
        <pre>
          <code>{JSON.stringify(state.context, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
};

export default Calculator;
