import $ from 'jquery';


function role(component) {
  const nodes = component.$('[data-role]');

  nodes.toArray().forEach((node) => {
    const roleNames = node.attributes['data-role'].value.split(' ');

    roleNames.forEach((roleName) => {
      if (!component[roleName]) {
        component[roleName] = $();
      }

      if (component[roleName].jquery) {
        component[roleName].push(node);
      }
    });
  });
}


export default role;
