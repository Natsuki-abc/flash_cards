<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class FolderPolicy
{
    use HandlesAuthorization;

    /**
     * フォルダの表示権限を判定
     */
    public function view(User $user, Folder $folder)
    {
        return $user->id === $folder->user_id;
    }

    /**
     * フォルダの更新権限を判定
     */
    public function update(User $user, Folder $folder)
    {
        return $user->id === $folder->user_id;
    }

    /**
     * フォルダの削除権限を判定
     */
    public function delete(User $user, Folder $folder)
    {
        return $user->id === $folder->user_id;
    }
}
