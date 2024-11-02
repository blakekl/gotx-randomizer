import * as Highcharts from 'highcharts';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import Chart from './Chart';
import { useMediaQuery } from 'react-responsive';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { labeledStatDto } from '../../models/game';

enum Tabs {
  COMPLETIONS = 'completions',
  NOMINATIONS = 'nominations',
  TIME_TO_BEAT = 'ttb',
}

const Statistics = observer(() => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dbStore } = useStores();
  const mostCompletedGames = dbStore.getMostCompletedGames();
  const mostCompletedGotmGames = dbStore.getMostCompletedGotmGames();
  const mostCompletedGotyGames = dbStore.getMostCompletedGotyGames();
  const mostCompletedRetrobitGames = dbStore.getMostCompletedRetrobitGames();
  const mostCompletedRetrobitYearGames =
    dbStore.getMostCompletedRetrobitYearGames();
  const mostCompletedRpgGames = dbStore.getMostCompletedRpgGames();
  const newestCompletedGames = dbStore.getNewestCompletions();
  const newestGotmCompletions = dbStore.getNewestGotmCompletions();
  const newestGotwotyCompletions = dbStore.getNewestGotwotyCompletions();
  const newestGotyCompletions = dbStore.getNewestGotyCompletions();
  const newestRetrobitCompletions = dbStore.getNewestRetrobitCompletions();
  const newestRpgCompletions = dbStore.getNewestRpgCompletions();
  const nominationsBeforeWin = dbStore.getTotalNominationsBeforeWinByGame();
  const topNominationWinsByUser = dbStore.getTopNominationWinsByUser();
  const mostNominatedGames = dbStore.getMostNominatedGames();
  const mostNominatedLosers = dbStore.getMostNominatedLoserGames();
  const avgTimeToBeatByMonth = dbStore
    .getAvgTimeToBeatByMonth()
    .map((x) => ({ label: x.label, value: Number(x.value?.toFixed(2)) || 0 }));
  const totalTimeToBeatByMonth = dbStore
    .getTotalTimeToBeatByMonth()
    .map((x) => ({ label: x.label, value: Number(x.value?.toFixed(2)) || 0 }));
  const longestMonthsByAvgTimeToBeat =
    dbStore.getLongestMonthsByAvgTimeToBeat();
  const shortestMonthsByAvgTimeToBeat =
    dbStore.getShortestMonthsByAvgTimeToBeat();
  const mostNominatedGamesByUser = dbStore.getMostNominatedGamesByUser();
  const nominationSuccessPercentByUser = dbStore
    .getNominationSuccessPercentByUser()
    .map((x) => labeledStatDto([x.name, x.success_rate]) || []);
  const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });

  useEffect(() => {
    if (searchParams.get('tab') === null) {
      searchParams.set('tab', Tabs.NOMINATIONS);
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const theme: Highcharts.Options = {
    colors: [
      '#058DC7',
      '#50B432',
      '#ED561B',
      '#DDDF00',
      '#24CBE5',
      '#64E572',
      '#FF9655',
      '#FFF263',
      '#6AF9C4',
    ],
    chart: {
      backgroundColor: '#282F2F',
    },
    title: {
      style: {
        color: '#FFF',
      },
    },
    subtitle: {
      style: {
        color: '#FFF',
      },
    },
    caption: {
      style: {
        color: '#FFF',
      },
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: {
          symbolFill: '#fff',
          symbolStroke: '#fff',
          theme: {
            fill: '#1F2424',
          },
        },
      },
    },
    navigation: {
      menuItemStyle: {
        backgroundColor: '#1F2424',
        color: '#fff',
      },
      menuItemHoverStyle: {
        backgroundColor: '#1ABC9C',
      },
      menuStyle: {
        backgroundColor: '#1F2424',
      },
    },
    xAxis: {
      labels: {
        style: {
          color: '#FFF',
        },
      },
      gridLineColor: '#444',
      title: {
        style: {
          color: '#FFF',
        },
      },
    },
    yAxis: {
      labels: {
        style: {
          color: '#FFF',
        },
      },
      gridLineColor: '#444',
      title: {
        style: {
          color: '#FFF',
        },
      },
    },
    legend: {
      itemStyle: {
        color: '#FFF',
      },
      itemHoverStyle: {
        color: '#FFF',
      },
    },
  };
  if (isDark) {
    Highcharts.setOptions(theme);
  }

  const completions = (
    <>
      <div className="column">
        <Chart
          data={mostCompletedGames}
          title="Most Completed Games - ALL"
          name="Completions"
        />
        <Chart
          data={mostCompletedGotmGames}
          title="Most Completed Games - Game of the Month"
          name="Completions"
        />
        <Chart
          data={mostCompletedGotyGames}
          title="Most Completed Games - Game of the Year"
          name="Completions"
        />
        <Chart
          data={newestGotmCompletions}
          title="Recent GotM Completions"
          name="Completions"
        />
        <Chart
          data={newestRpgCompletions}
          title="Recent RPG Completions"
          name="Completions"
        />
        <Chart
          data={newestGotwotyCompletions}
          title="Recent GotWotY Completions"
          name="Completions"
        />
      </div>
      <div className="column">
        <Chart
          data={mostCompletedRetrobitGames}
          title="Most Completed Games - Retrobits"
          name="Completions"
        />
        <Chart
          data={mostCompletedRetrobitYearGames}
          title="Most Completed Games - Retrobit of the Year"
          name="Completions"
        />
        <Chart
          data={mostCompletedRpgGames}
          title="Most Completed Games - RPG of the Quarter"
          name="Completions"
        />{' '}
        <Chart
          data={newestCompletedGames}
          title="Recently Completed Games"
          name="Completions"
        />
        <Chart
          data={newestRetrobitCompletions}
          title="Recent Retrobit Completions"
          name="Completions"
        />
        <Chart
          data={newestGotyCompletions}
          title="Recent GotY Completions"
          name="Completions"
        />
      </div>
    </>
  );
  const nominations = (
    <>
      <div className="column">
        <Chart
          data={nominationsBeforeWin}
          title="Most Nominations Before Win"
          name="Nominations"
        />
        <Chart
          data={mostNominatedGames}
          title="Most Nominated Games"
          name="Nominations"
        />
        <Chart
          data={mostNominatedLosers}
          title="Most Nominated Games Without a Win"
          name="Nominations"
        />
      </div>
      <div className="column">
        <Chart
          data={mostNominatedGamesByUser}
          title="Most Nominations by User"
          name="Nominations"
        />
        <Chart
          data={topNominationWinsByUser}
          title="Most Winning Nominations by User"
          name="Wins"
        />
        <Chart
          data={nominationSuccessPercentByUser}
          title="Nomination Success Percent by User"
          name="Success rate"
        />
      </div>
    </>
  );
  const timeToBeat = (
    <>
      <div className="column">
        <Chart
          data={longestMonthsByAvgTimeToBeat}
          title="Longest Months"
          name="Avg Time to Beat"
        />
        <Chart
          data={avgTimeToBeatByMonth}
          title="Average Time to Beat by Month"
          name="Hours"
        />
      </div>
      <div className="column">
        <Chart
          data={shortestMonthsByAvgTimeToBeat}
          title="Shortest Months"
          name="Average Time to Beat in Hours"
        />
        <Chart
          data={totalTimeToBeatByMonth}
          title="Total Time to Beat by Month"
          name="Total Time to Beat in Hours"
        />
      </div>
    </>
  );

  const tabsToHtmlMap = new Map([
    [Tabs.COMPLETIONS, completions],
    [Tabs.NOMINATIONS, nominations],
    [Tabs.TIME_TO_BEAT, timeToBeat],
  ]);

  return (
    <>
      <h1 className="title is-1 has-text-centered">Statistics</h1>
      <div className="tabs">
        <ul>
          <li
            className={classNames({
              'is-active':
                (searchParams.get('tab') as Tabs) === Tabs.NOMINATIONS,
            })}
          >
            <a
              onClick={() =>
                setSearchParams(new URLSearchParams({ tab: Tabs.NOMINATIONS }))
              }
            >
              Nominations
            </a>
          </li>
          <li
            className={classNames({
              'is-active':
                (searchParams.get('tab') as Tabs) === Tabs.COMPLETIONS,
            })}
          >
            <a
              onClick={() =>
                setSearchParams(new URLSearchParams({ tab: Tabs.COMPLETIONS }))
              }
            >
              Completions
            </a>
          </li>
          <li
            className={classNames({
              'is-active':
                (searchParams.get('tab') as Tabs) === Tabs.TIME_TO_BEAT,
            })}
          >
            <a
              onClick={() =>
                setSearchParams(new URLSearchParams({ tab: Tabs.TIME_TO_BEAT }))
              }
            >
              Time to Beat
            </a>
          </li>
        </ul>
      </div>
      <div className="columns">
        {tabsToHtmlMap.get(searchParams.get('tab') as Tabs) ||
          tabsToHtmlMap.get(Tabs.NOMINATIONS)}
      </div>
    </>
  );
});

export default Statistics;
