import * as Highcharts from 'highcharts';
import { useStores } from '../../stores/useStores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import classNames from 'classnames';
import Chart from './Chart';
import { useMediaQuery } from 'react-responsive';

enum Tabs {
    COMPLETIONS,
    NOMINATIONS,
    TIME_TO_BEAT,
}

const Statistics = observer(() => {
    const [selectedTab, setSelectedTab] = useState(Tabs.NOMINATIONS);
    const {randomizerStore} = useStores();
    const mostCompletedGames = randomizerStore.getMostCompletedGames();
    const newestCompletedGames = randomizerStore.getNewestCompletions();
    const newestGotmCompletions = randomizerStore.getNewestGotmCompletions();
    const newestGotwotyCompletions = randomizerStore.getNewestGotwotyCompletions();
    const newestGotyCompletions = randomizerStore.getNewestGotyCompletions();
    const newestRetrobitCompletions = randomizerStore.getNewestRetrobitCompletions();
    const newestRpgCompletions = randomizerStore.getNewestRpgCompletions();
    const nominationsBeforeWin = randomizerStore.getTotalNominationsBeforeWinByGame();
    const topNominationWinsByUser = randomizerStore.getTopNominationWinsByUser();
    const mostNominatedGames = randomizerStore.getMostNominatedGames();
    const mostNominatedLosers = randomizerStore.getMostNominatedLoserGames();
    const avgTimeToBeatByMonth = randomizerStore.getAvgTimeToBeatByMonth().map(x => ({label: x.label, value: Number(x.value.toFixed(2))}));
    const totalTimeToBeatByMonth = randomizerStore.getTotalTimeToBeatByMonth().map(x => ({label: x.label, value: Number(x.value.toFixed(2))}));
    const longestMonthsByAvgTimeToBeat = randomizerStore.getLongestMonthsByAvgTimeToBeat();
    const shortestMonthsByAvgTimeToBeat = randomizerStore.getShortestMonthsByAvgTimeToBeat();
    const mostNominatedGamesByUser = randomizerStore.getMostNominatedGamesByUser();
    const isDark = useMediaQuery({ query: '(prefers-color-scheme: dark)' });


    const theme: Highcharts.Options = {
        colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
                 '#FF9655', '#FFF263', '#6AF9C4'],
        chart: {
            backgroundColor: '#282F2F',
        },
        title: {
            style: {
                color: '#FFF',
            }
        },
        subtitle: {
            style: {
                color: '#FFF',
            }
        },
        caption: {
            style: {
                color: '#FFF'
            }
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    symbolFill: '#fff',
                    symbolStroke: '#fff',
                    theme: {
                        fill: '#1F2424'
                    }
                }
            }

        },
        navigation : {
            menuItemStyle: {
                backgroundColor: '#1F2424',
                color: '#fff',
            },
            menuItemHoverStyle: {
                backgroundColor: '#1ABC9C',
            },
            menuStyle: {
                backgroundColor: '#1F2424'
            }
        },
        xAxis: {
            labels: {
                style: {
                    color: "#FFF"
                }
            },
            gridLineColor: "#444",
            title: {
                style: {
                    color: '#FFF',
                }
            }
        },
        yAxis: {
            labels: {
                style: {
                    color: "#FFF"
                }
            },
            gridLineColor: "#444",
            title: {
                style: {
                    color: '#FFF',
                }
            }
        },
        legend: {
            itemStyle: {
                color: '#FFF'
            },
            itemHoverStyle:{
                color: '#FFF'
            }
        }
    };
    if (isDark) {
        Highcharts.setOptions(theme);
    }

    const completions = <>
            <div className="column">
                <Chart data={mostCompletedGames} title='Most Completed Games' name='Completions' />
                <Chart data={newestGotmCompletions} title='Recent GotM Completions' name='Completions' />
                <Chart data={newestRpgCompletions} title='Recent RPG Completions' name='Completions' />
                <Chart data={newestGotwotyCompletions} title='Recent GotWotY Completions' name='Completions' />
            </div>
            <div className="column">
                <Chart data={newestCompletedGames} title='Recently Completed Games' name="Completions" />
                <Chart data={newestRetrobitCompletions} title='Recent Retrobit Completions' name="Completions" />
                <Chart data={newestGotyCompletions} title='Recent GotY Completions' name="Completions" />
            </div>
    </>
    const nominations = <>
            <div className="column">
                <Chart data={nominationsBeforeWin} title='Most Nominations Before Win' name='Nominations' />
                <Chart data={mostNominatedGames} title='Most Nominated Games' name='Nominations' />
                <Chart data={mostNominatedLosers} title='Most Nominated Games Without a Win' name='Nominations' />
            </div>
            <div className="column">
                <Chart data={mostNominatedGamesByUser} title='Most Nominations by User' name='Nominations' />
                <Chart data={topNominationWinsByUser} title='Most Winning Nominations by User' name='Wins' />
            </div>
    </>;
    const timeToBeat = <>
            <div className="column">
                <Chart data={longestMonthsByAvgTimeToBeat} title='Longest Months' name='Avg Time to Beat' />
                <Chart data={avgTimeToBeatByMonth} title='Average Time to Beat by Month' name='Hours' />
            </div>
            <div className="column">
                <Chart data={shortestMonthsByAvgTimeToBeat} title='Shortest Months' name='Average Time to Beat in Hours' />
                <Chart data={totalTimeToBeatByMonth} title='Total Time to Beat by Month' name='Total Time to Beat in Hours' />
            </div>
    </>;

    const tabsToHtmlMap = new Map([
        [Tabs.COMPLETIONS, completions],
        [Tabs.NOMINATIONS, nominations],
        [Tabs.TIME_TO_BEAT, timeToBeat],
    ])

    return <>
        <h1 className="title has-text-centered">Statistics</h1>
        <div className="tabs">
            <ul>
                <li className={classNames({'is-active': selectedTab === Tabs.NOMINATIONS})}><a onClick={() => setSelectedTab(Tabs.NOMINATIONS)}>Nominations</a></li>
                <li className={classNames({'is-active': selectedTab === Tabs.COMPLETIONS})}><a className='link' onClick={() => setSelectedTab(Tabs.COMPLETIONS)}>Completions</a></li>
                <li className={classNames({'is-active': selectedTab === Tabs.TIME_TO_BEAT})}><a onClick={() => setSelectedTab(Tabs.TIME_TO_BEAT)}>Time to Beat</a></li>
            </ul>
        </div>
        <div className="columns">
            {tabsToHtmlMap.get(selectedTab)}
        </div>
    </>
})

export default Statistics;