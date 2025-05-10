<?php

namespace App\Policies;

use App\Models\Tag;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TagPolicy
{
    use HandlesAuthorization;

    /**
     * タグの更新権限を判定
     */
    public function update(User $user, Tag $tag)
    {
        return $user->id === $tag->user_id;
    }

    /**
     * タグの削除権限を判定
     */
    public function delete(User $user, Tag $tag)
    {
        return $user->id === $tag->user_id;
    }
}
