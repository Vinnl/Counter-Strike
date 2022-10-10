<?php

namespace Test\Game;

use cs\Core\GameProperty;
use cs\Core\GameState;
use cs\Core\Player;
use cs\Core\Util;
use cs\Enum\Color;
use cs\Event\GameOverEvent;
use cs\Event\KillEvent;
use cs\Event\PauseEndEvent;
use cs\Event\PauseStartEvent;
use cs\Event\RoundEndCoolDownEvent;
use cs\Event\RoundEndEvent;
use cs\Event\RoundStartEvent;
use Test\BaseTestCase;

class RoundTest extends BaseTestCase
{

    public function testRoundEndWhenNoPlayersAreAlive(): void
    {
        $playerCommands = [
            fn(Player $p) => $p->jump(),
            fn(Player $p) => $p->suicide(),
            $this->endGame(),
        ];

        $killEvents = [];
        $gameProperty = new GameProperty();
        $gameProperty->max_rounds = 1;
        $game = $this->createTestGame(null, $gameProperty);
        $break = false;
        $game->onEvents(function (array $events) use (&$killEvents, &$break): void {
            if ($break) {
                return;
            }
            if ($events[0] instanceof GameOverEvent) {
                $break = true;
            }

            foreach ($events as $event) {
                if ($event instanceof KillEvent) {
                    $killEvents[] = $event;
                }
            }
        });

        $this->assertSame(1, $game->getRoundNumber());
        $this->playPlayer($game, $playerCommands);
        $this->assertSame(2, $game->getRoundNumber());

        $this->assertTrue($break);
        $this->assertFalse($game->getPlayer(1)->isAlive());

        $this->assertCount(1, $killEvents);
        $killEvent = $killEvents[0];
        $this->assertInstanceOf(KillEvent::class, $killEvent);
        $this->assertFalse($killEvent->wasHeadShot());
        $this->assertSame(1, $killEvent->getPlayerDead()->getId());
        $this->assertSame(1, $killEvent->getPlayerCulprit()->getId());
    }

    public function testFreezeTime(): void
    {
        $game = $this->createGame([
            GameProperty::FREEZE_TIME_SEC => 0,
        ]);
        $this->assertTrue($game->isPaused());
        $game->tick(0);
        $this->assertFalse($game->isPaused());
        $events = $game->consumeTickEvents();
        $this->assertCount(3, $events);
        $this->assertInstanceOf(PauseStartEvent::class, $events[0]);
        $this->assertInstanceOf(PauseEndEvent::class, $events[1]);
        $this->assertInstanceOf(RoundStartEvent::class, $events[2]);
    }

    public function testFreezeTime1(): void
    {
        $game = $this->createGame([
            GameProperty::FREEZE_TIME_SEC => 1,
        ]);

        $tickId = false;
        foreach (range(0, (int)(1000 / Util::$TICK_RATE)) as $tickId) {
            $this->assertTrue($game->isPaused(), "Tick: {$tickId}");
            $game->tick($tickId);
        }
        $this->assertIsInt($tickId);
        $game->tick($tickId++);
        $this->assertFalse($game->isPaused());
    }

    public function testRoundEndEventFiredOncePerRoundEndActually(): void
    {
        $maxRounds = 5;
        $game = $this->createGame([
            GameProperty::MAX_ROUNDS    => $maxRounds,
            GameProperty::ROUND_TIME_MS => 1,
        ]);

        $roundEndEventsCount = 0;
        $roundCoolDownEventsCount = 0;
        $game->setTickMax($maxRounds * 2);
        $game->onTick(function (GameState $state) {
            $state->getPlayer(1)->moveForward();
        });
        $game->onEvents(function (array $events) use (&$roundEndEventsCount, &$roundCoolDownEventsCount): void {
            foreach ($events as $event) {
                if ($event instanceof RoundEndEvent) {
                    $roundEndEventsCount++;
                }
                if ($event instanceof RoundEndCoolDownEvent) {
                    $roundCoolDownEventsCount++;
                }
            }
        });
        $game->start();
        $this->assertSame($maxRounds, $roundEndEventsCount);
        $this->assertSame($maxRounds - 2, $roundCoolDownEventsCount); // (firstRound + halfTime)
        $this->assertSame($maxRounds + 1, $game->getRoundNumber());
    }

    public function testHalfTimeSwitch(): void
    {
        $maxRounds = 5;
        $game = $this->createGame([
            GameProperty::MAX_ROUNDS    => $maxRounds,
            GameProperty::ROUND_TIME_MS => 1,
        ]);
        $game->setTickMax($maxRounds * 2);

        $this->assertTrue($game->getPlayer(1)->isPlayingOnAttackerSide());
        $this->assertTrue($game->getScore()->isTie());

        $game->start();
        $this->assertSame($maxRounds + 1, $game->getRoundNumber());
        $this->assertFalse($game->getPlayer(1)->isPlayingOnAttackerSide());
        $this->assertFalse($game->getScore()->isTie());
        $this->assertTrue($game->getScore()->defendersIsWinning());
        $this->assertFalse($game->getScore()->attackersIsWinning());
        $this->assertSame(3, $game->getScore()->getScoreDefenders());
        $this->assertSame(2, $game->getScore()->getScoreAttackers());
    }

    public function testSighReset(): void
    {
        $player = new Player(2, Color::GREEN, false);
        $player->getSight()->lookAt(180, 1);
        $player->roundReset();
        $this->assertSame(0, $player->getSight()->getRotationHorizontal());
        $this->assertSame(0, $player->getSight()->getRotationVertical());
        $player->getSight()->lookAt(179, 12);
        $this->assertSame(179, $player->getSight()->getRotationHorizontal());
        $this->assertSame(12, $player->getSight()->getRotationVertical());
    }

}
