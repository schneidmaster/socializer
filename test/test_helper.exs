{:ok, _} = Application.ensure_all_started(:ex_machina)

ExUnit.configure(exclude: [pending: true], formatters: [JUnitFormatter, ExUnit.CLIFormatter])
ExUnit.start()
Faker.start()
Ecto.Adapters.SQL.Sandbox.mode(Socializer.Repo, :manual)
