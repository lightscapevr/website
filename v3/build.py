#!/usr/bin/env python

import os
from jinja2 import Environment, PackageLoader, select_autoescape
import json

# Set up Jinja2 environment
jinja_env = Environment(
    loader=PackageLoader('build', 'templates'),
    autoescape=select_autoescape(['html'])
)


def render_to_file(html_input_path, output_folder, view_data):
    template = jinja_env.get_template(html_input_path)
    rendered_html = template.render(view_data)

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(output_folder + '\\' + html_input_path, "w") as output_file:
        output_file.write(rendered_html)


if __name__ == '__main__':
    # List of files to render.
    # Input files must be in the 'templates' folder (match jinja_env path)
    render_to_file('t_index.html', 'web', dict(
        name="Yip",
        my_list=["one", "2"],
        nav_menu=[dict(name="L1", link="#"),
                  dict(name="L2", link="#")]
    ))
