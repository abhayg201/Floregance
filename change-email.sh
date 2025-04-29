#!/bin/sh

git filter-branch -f --env-filter '
OLD_EMAIL="159125892+gpt-engineer-app[bot]@users.noreply.github.com"
NEW_EMAIL="abhayg200001@gmail.com"
NEW_NAME="Abhay Godara"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$NEW_NAME"
    export GIT_COMMITTER_EMAIL="$NEW_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$NEW_NAME"
    export GIT_AUTHOR_EMAIL="$NEW_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags