// este arquivo será de armazenamento dos dados que serão exibidos na dashboar
const agendamentos = 0;

class Dashboard {
    static quantidadeAgendamentos(quant) {
        agendamentos = agendamentos + quant;
        return agendamentos;
    }
}

module.exports = { Dashboard };