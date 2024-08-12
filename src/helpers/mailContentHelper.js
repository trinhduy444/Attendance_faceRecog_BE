const warningMailCG = function (result) {
    return `Cảnh báo sinh viên ${result?.student_name} gần bị cấm thi môn: <strong>${result?.course_name}</strong> , nhóm: <strong>${result?.group_code}</strong>.
            <br /> Đề nghị sinh viên đi học đầy đủ trong khoảng thời gian tới.
            <br /><li><i>Mọi thắc mắc sinh viên liên hệ với giáo viên hoặc tới văn phòng khoa để giải quyết</i></li>`
}
const banMailCG = function (result) {
    return `Sinh viên ${result?.student_name} bị cấm thi môn: ${result?.course_name}, nhóm: ${result?.group_code}.
            <br /> Nếu có thắc mắc sinh viên vui lòng liên hệ với văn phòng khoa`
}

module.exports = { warningMailCG,banMailCG }