<?php

namespace cs\Event;

use Closure;

final class RoundStartEvent extends TickEvent
{

    public function __construct(private int $aliveAttackers, private int $aliveDefenders, Closure $callback)
    {
        parent::__construct($callback);
    }

    public function serialize(): array
    {
        return [
            'attackers' => $this->aliveAttackers,
            'defenders' => $this->aliveDefenders,
        ];
    }

}
