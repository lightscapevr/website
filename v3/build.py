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


def convert_all_markdown(src_folder, output_folder):
    for filename in os.listdir(src_folder):
        if filename.endswith('.md'):
            name_only = filename[:-3]
            html_from_markdown(src_folder + '//' + filename,
                               output_folder + '//' + name_only + '.html')


def render_all_templates():
    for filename in os.listdir('templates'):
        if filename.endswith('.html'):
            page_title = generate_title_from_html_filename(filename)
            render_template_to_file(filename, dict(title=page_title))


def render_template_to_file(template_path, view_data):
    # Input files must be in the 'templates' folder (matching jinja_env path)
    template = jinja_env.get_template(template_path)
    rendered_html = template.render(view_data)

    output_folder = 'web'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    write_html_file(output_folder + '\\' + template_path, rendered_html)


def html_from_markdown(markdown_path, output_path):
    with open(markdown_path) as f:
        html_data = markdown.Markdown().convert(f.read().decode('utf8'))
    write_html_file(output_path, html_data)


def write_html_file(output_path, html_data):
    with open(output_path, "w") as output_file:
        output_file.write(html_data.encode('utf-8'))


def generate_title_from_html_filename(filename):
    assert filename.endswith('.html')
    if filename == 'index.html':
        return 'VR Sketch | Design in virtual reality'
    title = filename[:-4]
    title = title.replace('docs-', '')
    if title == 'faqs':
        return 'FAQs | VR Sketch'
    title = filename.title()  # capitalize the first letter
    return title + ' | VR Sketch'


if __name__ == '__main__':
    convert_all_markdown('markdown', 'templates/generated/')
    render_all_templates()
    print("Build complete")
