<?php

namespace App\Policies;

use App\Models\Card;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class CardPolicy
{
    use HandlesAuthorization;

    /**
     * フラッシュカードの表示権限を判定
     */
    public function view(User $user, Card $card)
    {
        return $user->id === $card->folder->user_id;
    }

    /**
     * フラッシュカードの更新権限を判定
     */
    public function update(User $user, Card $card)
    {
        return $user->id === $card->folder->user_id;
    }

    /**
     * フラッシュカードの削除権限を判定
     */
    public function delete(User $user, Card $card)
    {
        return $user->id === $card->folder->user_id;
    }
}
