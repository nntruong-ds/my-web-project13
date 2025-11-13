const employees = [
    {
        id: 1,
        username: "truong88",
        password: "123",
        name: "Nguyễn Ngọc Trường",
        birthday: "20/11/2005",
        sex:"Nam",
        address:"Vĩnh Phúc",
        email: "truong@gmail.com",
        position: "Nhân viên",
        department: "IT",
        branch: "A+88",
        avatar: require("../components/css/ava1.png"),
        salary: {
            income: 10,
            deduction: 3,
            advance: 1,
            bonus: 1,
            allowance: 1
        },

        timesheet: {
            workDays: 24,
            overtime: 0,
            lateEarly: 0,
            absent: 2,
            checkinTime: "08:00"
        }
    },

    {
        id: 2,
        username: "quy99",
        password: "123",
        name: "Vũ Đức Quý",
        birthday: "19/06/2005",
        sex:"Nam",
        address:"Bắc Ninh",
        email: "quydky2k5@gmail.com",
        position: "Nhân viên",
        department: "Kế toán",
        branch: "B2",
        avatar: require("../components/css/ava2.png"),
        salary: {
            income: 20,
            deduction: 2,
            advance: 2,
            bonus: 3,
            allowance: 1
        },

        timesheet: {
            workDays: 22,
            overtime: 3,
            lateEarly: 1,
            absent: 1,
            checkinTime: "08:10"
        }
    }
];

export default employees;
