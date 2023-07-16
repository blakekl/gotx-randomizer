import { toast } from 'bulma-toast';
import classNames = require('classnames');
import * as React from 'react';
import { useMediaQuery } from 'react-responsive';
import './style.css';
import { useData } from './hooks/useData';

export default function App() {
  const imgEl = React.useRef<HTMLImageElement>(null);
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
  const [showSettings, setShowSettings] = React.useState(true);
  const [loaded, setLoaded] = React.useState(false);
  const [includeGotmWinners, setIncludeGotmWinners] = React.useState(true);
  const [includeGotmRunnerUp, setIncludeGotmRunnerUp] = React.useState(false);
  const [includeRetrobits, setIncludeRetrobits] = React.useState(false);
  const [includeRpgWinners, setIncludeRpgWinners] = React.useState(false);
  const [includeRpgRunnerUp, setIncludeRpgRunnerUp] = React.useState(false);
  const [gamePool, setGamePool] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(
    Math.floor(Math.random() * gamePool.length)
  );
  const {
    nominators,
    nominations,
    gotmWinners,
    gotmRunnerUp,
    retrobits,
    rpgWinners,
    rpgRunnerUp,
  } = useData();
}
