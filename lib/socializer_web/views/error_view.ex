defmodule SocializerWeb.ErrorView do
  use Phoenix.View,
    root: "lib/socializer_web/templates",
    namespace: SocializerWeb

  def template_not_found(template, _assigns) do
    %{errors: %{detail: Phoenix.Controller.status_message_from_template(template)}}
  end
end
