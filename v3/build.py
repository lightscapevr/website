#!/usr/bin/env python

import os
from jinja2 import Environment, PackageLoader, select_autoescape
import json
import markdown

# Set up Jinja2 environment
jinja_env = Environment(
    loader=PackageLoader('build', 'templates'),
    autoescape=select_autoescape(['html'])
)


def render_template_to_file(template_path, view_data):
    # Input files must be in the 'templates' folder (matching jinja_env path)
    template = jinja_env.get_template(template_path)
    rendered_html = template.render(view_data)

    output_folder = 'web'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # with open(output_folder + '\\' + template_path, "w") as output_file:
    #     output_file.write(rendered_html.encode('utf-8'))
    write_html_file(output_folder + '\\' + template_path, rendered_html)


def html_from_markdown(markdown_path, output_path):
    with open(markdown_path) as f:
        html_data = markdown.Markdown().convert(f.read().decode('utf8'))
    write_html_file(output_path, html_data)


def write_html_file(output_path, html_data):
    with open(output_path, "w") as output_file:
        output_file.write(html_data.encode('utf-8'))


if __name__ == '__main__':
    # 1. Convert all markdown to html
    html_from_markdown('markdown/documentation.md',
                       'templates/generated/docs-markdown.html')

    # 2. Render all templates
    render_template_to_file('index.html', dict(
        title="VR Sketch | Design in virtual reality"))

    render_template_to_file('documentation.html', dict(
        title="Documentation | VR Sketch"))

    render_template_to_file('tutorials.html', dict(
        title="Tutorials | VR Sketch"))

    render_template_to_file('faqs.html', dict(
        title="FAQs | VR Sketch"))

    render_template_to_file('blog.html', dict(
        title="Blog | VR Sketch"))

    print("Build complete")
