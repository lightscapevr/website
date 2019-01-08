#!/usr/bin/env python
""" Run build.py (--prod|--test) to rebuild html
"""

import os
from jinja2 import Environment, PackageLoader, select_autoescape
import json
import markdown
import sass
import sys

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


def render_all_templates(prod):
    for filename in os.listdir('templates'):
        if filename.endswith('.html'):
            page_title = generate_title_from_html_filename(filename)
            d = {'title': page_title}
            if prod:
                d['chargebee_site'] = 'baroquesoftware'
            else:
                d['chargebee_site'] = 'baroquesoftware-test'
            render_template_to_file(filename, d)


def render_template_to_file(template_path, view_data):
    # Input files must be in the 'templates' folder (matching jinja_env path)
    template = jinja_env.get_template(template_path)
    rendered_html = template.render(view_data)

    output_folder = 'web'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    write_string_file(os.path.join(output_folder, template_path),
                      rendered_html)


def html_from_markdown(markdown_path, output_path):
    with open(markdown_path) as f:
        html_data = markdown.Markdown().convert(f.read().decode('utf8'))
    write_string_file(output_path, html_data)


def write_string_file(output_path, string_data):
    with open(output_path, "w") as output_file:
        output_file.write(string_data.encode('utf-8'))


def covert_sass_to_css(sass_filepath, output_filepath):
    assert sass_filepath.endswith('.scss')
    assert output_filepath.endswith('.css')
    # create normal human readable .css
    css_data = sass.compile(filename=sass_filepath, output_style='expanded')
    write_string_file(output_filepath, css_data)
    # create compressed .min.css and sourcemap .min.css.map
    min_output_filepath = output_filepath[:-4] + ".min.css"
    css_data_min = sass.compile(
        filename=sass_filepath, output_style='compressed')
    write_string_file(min_output_filepath, css_data_min)

    # TODO logic for making a .map file but the files names and paths did ot match
    # map_name = os.path.basename(output_filepath)[:-4] + ".min.css.map"
    # map_output_filepath = output_filepath[:-4] + ".min.css.map"
    #  css_data_min = sass.compile(
    #     filename=sass_filepath, output_style='compressed', source_map_filename=map_name)
    # write_string_file(min_output_filepath, css_data_min[0])
    # write_string_file(map_output_filepath, css_data_min[1])


def generate_title_from_html_filename(filename):
    assert filename.endswith('.html')
    if filename == 'index.html':
        return 'VR Sketch | Design in virtual reality'
    title = filename[:-5]
    title = title.replace('docs-', '')
    if title == 'faqs':
        return 'FAQs | VR Sketch'
    title = title.title()  # capitalize the first letter
    return title + ' | VR Sketch'


if __name__ == '__main__':
    if len(sys.argv) != 2 or (sys.argv[1] != '--prod' and sys.argv[1] != '--test'):
        print __doc__
        sys.exit(1)
    convert_all_markdown('markdown', 'templates/generated/')
    render_all_templates(sys.argv[1] == '--prod')
    covert_sass_to_css('scss/styles.scss', 'web/css/styles.css')
    # TODO vue app must not be passed through jinja because {{}} gets removed
    # After jinga is done, then add in the vue app
    print("Build complete")
