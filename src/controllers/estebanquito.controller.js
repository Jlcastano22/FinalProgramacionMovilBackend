import getConnection from '../database/database.js';

const getUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM usuarios');
    res.json(result[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getPrestamo = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM prestamos');
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getReporte = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM reportes');
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getTransaccion = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM transacciones');
    res.json(result);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTransaccionById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM transacciones WHERE cuenta_id = ?', [id]);

    if (result.length > 0) {
      res.json(result);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPrestamoById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM prestamos WHERE usuario_id = ?', [id]);

    if (result.length > 0) {
      res.json(result);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getReporteById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();
    const [result] = await connection.query('SELECT * FROM reportes WHERE usuario_id = ?', [id]);

    if (result.length > 0) {
      res.json(result);
    } else {
      return res.status(200).json([]);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const postUsuario = async (req, res) => {
  try {
    const { nombre, email, contraseña, numero_cuenta, tipo, saldo } = req.body;
    const connection = await getConnection();
    const result = await connection.query(
      'INSERT INTO usuarios (nombre, email, contraseña, numero_cuenta, tipo, saldo) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, email, contraseña, numero_cuenta, tipo, saldo]
    );
    res.json({ message: 'Usuario creado correctamente', result });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const postTransaccion = async (req, res) => {
  try {
    const { cuenta_id, tipo, monto, fecha } = req.body;
    const connection = await getConnection();
    const result = await connection.query(
      'INSERT INTO transacciones (cuenta_id, tipo, monto, fecha) VALUES ( ?, ?, ?, ?)',
      [cuenta_id, tipo, monto, fecha]
    );
    res.json({ message: 'Transacción registrada correctamente', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postTransaccionTransferencia = async (req, res) => {
  try {
    const { cuenta_id, tipo, monto, fecha } = req.body;
    const connection = await getConnection();

    const [cuentaResult] = await connection.query('SELECT id FROM usuarios WHERE numero_cuenta = ?', [cuenta_id]);

    if (cuentaResult.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const usuarioId = cuentaResult[0].id;

    const result = await connection.query(
      'INSERT INTO transacciones (cuenta_id, tipo, monto, fecha) VALUES ( ?, ?, ?, ?)',
      [usuarioId, tipo, monto, fecha]
    );

    res.json({ message: 'Transacción registrada correctamente', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postPrestamo = async (req, res) => {
  try {
    const { cuenta_id, monto, plazo, estado, fecha } = req.body;
    const connection = await getConnection();
    const [existingLoan] = await connection.query('SELECT * FROM prestamos WHERE usuario_id = ?', [cuenta_id]);
    const result = await connection.query(
      'INSERT INTO prestamos (usuario_id, monto, plazo, estado, fecha_solicitud) VALUES ( ?, ?, ?, ?, ?)',
      [cuenta_id, monto, plazo, estado, fecha]
    );
    res.json({ message: 'Prestamo registrado correctamente', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postReporte = async (req, res) => {
  try {
    const connection = await getConnection();

    const [rows] = await connection.query('SELECT id FROM usuarios ORDER BY id DESC LIMIT 1');

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró ningún usuario.' });
    }

    const cuenta_id = rows[0].id;

    const [result] = await connection.query(
      'INSERT INTO reportes (usuario_id, historico_ingresos, historico_egresos, deudas) VALUES (?, ?, ?, ?)',
      [cuenta_id, 0, 0, 0]
    );

    res.json({ message: 'Reporte registrado correctamente', result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSaldoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    let { nuevoSaldo } = req.body;
    const connection = await getConnection();

    const [saldoResult] = await connection.query('SELECT saldo FROM usuarios WHERE id = ?', [id]);
    if (saldoResult.length > 0) {
      const saldoActual = saldoResult[0].saldo;

      nuevoSaldo = parseFloat(saldoActual) + parseFloat(nuevoSaldo);

      const [updateResult] = await connection.query('UPDATE usuarios SET saldo = ? WHERE id = ?', [nuevoSaldo, id]);
      if (updateResult.affectedRows > 0) {
        res.json({ message: 'Saldo actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateSaldoUsuarioByCuenta = async (req, res) => {
  try {
    const { cuenta } = req.params;
    let { nuevoSaldo } = req.body;
    const connection = await getConnection();

    const [saldoResult] = await connection.query('SELECT saldo FROM usuarios WHERE numero_cuenta = ?', [cuenta]);
    if (saldoResult.length > 0) {
      const saldoActual = saldoResult[0].saldo;

      nuevoSaldo = parseFloat(saldoActual) + parseFloat(nuevoSaldo);

      const [updateResult] = await connection.query('UPDATE usuarios SET saldo = ? WHERE numero_cuenta = ?', [
        nuevoSaldo,
        cuenta,
      ]);
      if (updateResult.affectedRows > 0) {
        res.json({ message: 'Saldo actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateHistoricoIngreso = async (req, res) => {
  try {
    const { id } = req.params;
    let { nuevoIngreso } = req.body;
    const connection = await getConnection();

    const [ingresoResult] = await connection.query('SELECT historico_ingresos FROM reportes WHERE usuario_id = ?', [
      id,
    ]);
    if (ingresoResult.length > 0) {
      const ingresoActual = ingresoResult[0].historico_ingresos;

      nuevoIngreso = parseFloat(ingresoActual) + parseFloat(nuevoIngreso);

      const [updateResult] = await connection.query('UPDATE reportes SET historico_ingresos = ? WHERE usuario_id = ?', [
        nuevoIngreso,
        id,
      ]);
      if (updateResult.affectedRows > 0) {
        res.json({ message: 'Ingreso actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateHistoricoEgreso = async (req, res) => {
  try {
    const { id } = req.params;
    let { nuevoEgreso } = req.body;
    const connection = await getConnection();

    const [egresoResult] = await connection.query('SELECT historico_egresos FROM reportes WHERE usuario_id = ?', [id]);
    if (egresoResult.length > 0) {
      const egresoActual = egresoResult[0].historico_egresos;

      nuevoEgreso = parseFloat(egresoActual) + parseFloat(nuevoEgreso);

      const [updateResult] = await connection.query('UPDATE reportes SET historico_egresos = ? WHERE usuario_id = ?', [
        nuevoEgreso,
        id,
      ]);
      if (updateResult.affectedRows > 0) {
        res.json({ message: 'Egreso actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateHistoricoIngresoByCuenta = async (req, res) => {
  try {
    const { cuenta } = req.params;
    let { nuevoIngreso } = req.body;
    const connection = await getConnection();
    const [usuario_id] = await connection.query('SELECT id FROM usuarios WHERE numero_cuenta = ?', [cuenta]);
    const [ingresoResult] = await connection.query('SELECT historico_ingresos FROM reportes WHERE usuario_id = ?', [
      usuario_id[0].id,
    ]);
    if (ingresoResult.length > 0) {
      const ingresoActual = ingresoResult[0].historico_ingresos;

      nuevoIngreso = parseFloat(ingresoActual) + parseFloat(nuevoIngreso);

      const [updateResult] = await connection.query('UPDATE reportes SET historico_ingresos = ? WHERE usuario_id = ?', [
        nuevoIngreso,
        usuario_id[0].id,
      ]);
      if (updateResult.affectedRows > 0) {
        res.json({ message: 'Ingreso actualizado correctamente' });
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const metodosBanco = {
  getUsuario,
  getPrestamo,
  getReporte,
  getTransaccion,
  getUsuarioById,
  getPrestamoById,
  getTransaccionById,
  getReporteById,
  postUsuario,
  postTransaccion,
  postTransaccionTransferencia,
  postPrestamo,
  postReporte,
  updateSaldoUsuario,
  updateSaldoUsuarioByCuenta,
  updateHistoricoIngreso,
  updateHistoricoEgreso,
  updateHistoricoIngresoByCuenta,
};
