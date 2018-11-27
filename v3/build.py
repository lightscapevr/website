#!/usr/bin/env python

import os
from jinja2 import Environment, PackageLoader, select_autoescape
import json

# Set up Jinja2 environment
jinja_env = Environment(
    loader=PackageLoader('build', 'templates'),
    autoescape=select_autoescape(['html'])
)


def render_template_to_file(template_path, output_folder, view_data):
    template = jinja_env.get_template(template_path)
    rendered_html = template.render(view_data)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(output_folder + '\\' + template_path, "w") as output_file:
        output_file.write(rendered_html.encode('utf-8'))


if __name__ == '__main__':
    # List of files to render.
    # Input files must be in the 'templates' folder (match jinja_env path)
    render_template_to_file('t_index.html', 'web', dict(
        nav_menu=[dict(name="Features", link="#features"),
                  dict(name="Pricing", link="#pricing"),
                  dict(name="Gallery", link="#gallery"),
                  dict(name="Documentation", link="#"),
                  dict(name="Blog", link="#")]
    ))
    print("Build complete")
