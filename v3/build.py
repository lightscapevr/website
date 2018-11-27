#!/usr/bin/env python

import os
from jinja2 import Environment, PackageLoader, select_autoescape
import json

# Set up Jinja2 environment
jinja_env = Environment(
    loader=PackageLoader('build', 'templates'),
    autoescape=select_autoescape(['html'])
)


def render_template_to_file(template_path, view_data):
    template = jinja_env.get_template(template_path)
    rendered_html = template.render(view_data)

    output_folder = 'web'
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    with open(output_folder + '\\' + template_path, "w") as output_file:
        output_file.write(rendered_html.encode('utf-8'))


if __name__ == '__main__':
    # List of files to render.
    # Input files must be in the 'templates' folder (match jinja_env path)
    render_template_to_file('index.html', dict(
        title="VR Sketch | Design in virtual reality",
        nav_menu=[dict(name="Features", link="#features"),
                  dict(name="Pricing", link="#pricing"),
                  dict(name="Gallery", link="#gallery"),
                  dict(name="Learn", link="#learn"),
                  dict(name="Blog", link="#")]
    ))
    render_template_to_file('knowledge.html', dict(
        title="Knowledge Base | VR Sketch",
        nav_menu=[dict(name="Documentation", link="documentation.html"),
                  dict(name="FAQs", link="faqs.html"),
                  dict(name="Tutorials", link="tutorials.html")]
    ))
    render_template_to_file('documentation.html', dict(
        title="Documentation | VR Sketch",
        nav_menu=[dict(name="Documentation", link="documentation.html"),
                  dict(name="FAQs", link="faqs.html"),
                  dict(name="Tutorials", link="tutorials.html")]
    ))
    render_template_to_file('tutorials.html', dict(
        title="Tutorials | VR Sketch",
        nav_menu=[dict(name="Documentation", link="documentation.html"),
                  dict(name="FAQs", link="faqs.html"),
                  dict(name="Tutorials", link="tutorials.html")]
    ))
    render_template_to_file('faqs.html', dict(
        title="FAQs | VR Sketch",
        nav_menu=[dict(name="Documentation", link="documentation.html"),
                  dict(name="FAQs", link="faqs.html"),
                  dict(name="Tutorials", link="tutorials.html")]
    ))

    render_template_to_file('requirements.html', dict(
        title="Requirements | VR Sketch"))
    print("Build complete")
