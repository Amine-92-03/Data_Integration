module.exports.opt = (title) => {
    return {
        format: `Loading files To MSSQL [{bar}] {percentage}% |  Duration:{duration_formatted} | {value}/{total} | ETA: {eta_formatted}`,
        barCompleteChar: '#',
        barIncompleteChar: '.',
        fps: 25,
        stream: process.stdout,
        barsize: 40,
        position: 'center',
        align : 'left',
        hideCursor : true, //hide the cursor during progress operation; restored on complete (default: false) - pass null to keep terminal settings
        linewrap : false,
        etaBuffer : 9,
        // etaAsynchronousUpdate : true,
        barGlue :'',
        // emptyOnZero :true
    }
}



