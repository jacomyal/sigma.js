import glob
from textwrap import dedent, indent

TEMPLATE = dedent("""
const shader = /* glsl */`
%s
`;

export default shader;
""")

for p in glob.iglob('./src/renderers/webgl/shaders/*.glsl'):
    new_p = p.replace('.glsl', '.ts')

    with open(p) as f, open(new_p, 'w') as o:
        o.write((TEMPLATE % indent(f.read().strip(), '')).strip() + '\n')
