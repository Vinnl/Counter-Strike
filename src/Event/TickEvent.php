<?php

namespace cs\Event;

use Closure;

class TickEvent extends Event
{
    protected ?Closure $callback = null;
    protected int $maxTickCount = 1;

    public function __construct(?Closure $callback = null, int $maxTickCount = 1)
    {
        $this->callback = $callback;
        $this->maxTickCount = $maxTickCount;
    }

    final public function process(int $tick): void
    {
        $this->tickCount++;
        if ($this->callback) {
            call_user_func($this->callback, $this, $tick);
        }
        if ($this->tickCount === $this->maxTickCount && $this->onComplete !== []) {
            foreach ($this->onComplete as $func) {
                call_user_func($func, $this);
            }
        }
    }

}
