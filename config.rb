activate :external_pipeline,
         name: :webpack,
         command: build? ?  "yarn run build" : "yarn run start",
         source: ".tmp/dist",
         latency: 1

# Dev
configure :development do
  activate :livereload
  activate :directory_indexes
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

# Prod
configure :build do
  activate :asset_hash
  activate :relative_assets
  set :relative_links, true
end
