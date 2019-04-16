web: if [ "$PROCFILE_ENV" = "heroku" ]; then cd client && yarn serve; else elixir --name $MY_NODE_NAME --cookie $MY_COOKIE -S mix phx.server; fi
