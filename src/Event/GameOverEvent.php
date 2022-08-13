<?php

namespace cs\Event;

use cs\Enum\GameOverReason;

final class GameOverEvent extends TickEvent
{

    public function __construct(public readonly GameOverReason $reason)
    {
    }

    public function serialize(): array
    {
        return [
            'reason' => $this->reason->value,
        ];
    }

}
